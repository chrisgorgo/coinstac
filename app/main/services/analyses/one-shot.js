var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var FreeSurfer = require('freesurfer-parser');
var osr = require('coinstac-distributed-algorithm-set').oneShotRegression;

/**
 * analyze files requested from render process
 * post-analysis, emits event with results of object of form
 *     {
 *         requestId: {number},
 *         results: {
 *             result: {output, from, analysis, routine}
 *             fileShas: [array, of, shas]
 *         },
 *         error: { ... serialized error, if applicable ... }
 *     }
 * @param  {event} event
 * @param  {object} request object of form {requestId: number, files: [set, of, files (ref models/file.js)]}
 * @return {undefined}
 */
module.exports = function(event, request) {
    var result = {};
    var roiPromises;
    var analysisMeta = {
        predictors: ['rhCortexVol', 'CortexVol'],
        getDependentVars: function(file) {
            // return true if file is for a control
            return !!_.get(file, 'tags.control');
        }
    };

    /**
     * get input to oneShotRegression analysis from roi values and files
     * @param  {object} rois object of ROIs and volumes parsed from file
     * @param  {object} fileMeta metadata about the file
     * @return {object} object with predictors and dependentVar props
     */
    var getAnalysisInputs = function(rois, file) {
        var predictors = _.map(analysisMeta.predictors, function(roiName) {
            if (_.isUndefined(rois[roiName])) {
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

    if (!request.files) {
        result.error = new Error('No files received via IPC');
        console.log(result.error.message);
        sendResult(result);
        return;
    }

    roiPromises = request.files.map(function readAndParseFiles(file) {
        var filePath = path.join(file.dirname, file.filename);
        return fs.readFileAsync(filePath)
            .then(function parseFile(data) {
                debugger;
                var str = data.toString();
                return new FreeSurfer({string: str});
            })
            .then(_.partialRight(getAnalysisInputs, file));
    });

    Promise.all(roiPromises)
        .then(function computeRegression(analysisInputs) {
            var predictors = _.pluck(analysisInputs, 'predictors');
            var response = _.pluck(analysisInputs, 'dependentVars');
            var regressor = _.range(1, predictors[0].length + 1, 0);
            var osrResult = osr.objective(regressor, predictors, response);
            debugger;
            result = {
                fileShas: _.pluck(request.files, 'sha'),
                result: osrResult
            };
            sendResult(result);
        })
        .catch(function(err) {
            result.error = {
                message: err.message,
                trace: err.trace
            };;
            console.error('Error reading and parsing file: ', err.message);
            console.error(err.trace);
            sendResult(result);
        });
};
