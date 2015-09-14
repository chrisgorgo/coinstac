var fs = require('fs');
var ipc = require('ipc');
var path = require('path');
var _ = require('lodash');
var FreeSurfer = require('freesurfer-parser');
var osr = require('coinstac-distributed-algorithm-set').oneShotRegression;

ipc.on('analyze-files', function(event, request) {
    var result;
    var roiPromises;
    var analysisMeta = {
        predictors: ['CortexVol'],
        getDependentVars: function(file) {
            // return true if file is for a control
            return !!file.tags.control;
        }
    };

    /**
     * get input to oneShotRegression analysis from roi values and files
     * @param  {object} rois object of ROIs and volumes parsed from file
     * @param  {object} fileMeta metadata about the file
     * @return {object} object with predictors and dependentVar props
     */
    var getAnalysisInputs = function(rois, file) {
        var predictorKeys = analysisMeta.predictors;
        var predictors = _.map(predictorKeys, function(res, roiName) {
            if (_.undefined(res[roiName])) {
                throw new ReferenceError(['Could not locate',
                    roiName,
                    'in data for file',
                    path.join(file.dirname, file.filename)
                ].join(' '));
            }

            return rois[roiName];
        });

        return {
            predictors: predictors,
            dependentVars: analysisMeta.getDependentVars(file)
        };
    };

    /**
     * send result over ipc
     * @param  {any} result the result object to send
     * @return {none}        none
     */
    var sendResult = function(result) {
        event.sender.send('files-analyzed', {
            requestId: request.requestId,
            result: result
        });
    };

    if (!request.filePaths) {
        result.error = new Error('No files received via IPC');
        console.log(result.error.message);
        sendResult(result);
        return;
    }

    roiPromises = request.files.map(function readAndParseFiles(file) {
        var filePath = path.join(file.dirname, file.filename);
        return fs.readFileAsync(filePath)
            .then(function parseFile(data) {
                var str = data.toString();
                return new FreeSurfer({string: string});
            })
            .then(_.partialRight(getAnalysisInputs, file));
    });

    Promise.all(roiPromises)
        .then(function computeRegression(analysisInputs) {
            var predictors = _.pluck(analysisInputs, 'predictors');
            var response = _.pluck(analysisInputs, 'dependentVars');
            var regressor = _.range(1, predictors[0].length, 0);
            var osrResult = osr.objective(regressor, predictors, response);
            result = {
                fileShas: _.pluck(files, 'sha'),
                result: osrResult
            };
        })
        .catch(function(err) {
            result.error = err;
            console.log('Error reading and parsing file: ', error.message);
            sendResult(result);
        });
});
