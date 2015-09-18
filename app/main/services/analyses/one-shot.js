var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var FreeSurfer = require('freesurfer-parser');
var osr = require('coinstac-distributed-algorithm-set').oneShotRegression;

/*
 * @param  {object} request object of form {requestId: number, files: [set, of, files (ref models/file.js)]}
 * @return {undefined}
 */
module.exports = function(request) {
    var result = {};
    var roiPromises;
    if (!request) {
        throw new ReferenceError('no request config provided');
    }
    if (!request.predictors || !_.isArray(request.predictors)) {
        throw new ReferenceError('request must contain array of ROI predictors');
    }
    if (!request.files) {
        throw new ReferenceError('No files received via IPC');
    }

    var analysisMeta = {
        predictors: request.predictors,
        getDependentVars: function(file) {
            // return true if file is for a control
            return _.get(file, 'tags.control') ? 0 : 1;
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
                throw new ReferenceError([
                    'Could not locate',
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

    roiPromises = request.files.map(function readAndParseFiles(file) {
        var filePath = path.join(file.dirname, file.filename);
        return fs.readFileAsync(filePath)
            .then(function parseFile(data) {
                var str = data.toString();
                return new FreeSurfer({string: str});
            })
            .then(_.partialRight(getAnalysisInputs, file))
            .catch(function addFileMetaToError(err) {
                err.data = err.data ||  {};
                _.assign(err.data, {file: file});
                throw err;
            });
    });

    return Promise.all(roiPromises)
        .then(function computeRegression(analysisInputs) {
            var predictors = _.pluck(analysisInputs, 'predictors');
            var response = _.pluck(analysisInputs, 'dependentVars');
            var regressor = _.range(1, predictors[0].length + 1, 0);
            var minimizedRegressors = osr.minimize(regressor, predictors, response);
            return _.zipObject(analysisMeta.predictors, minimizedRegressors);
        });
};
