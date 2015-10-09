var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var FreeSurfer = require('freesurfer-parser');
var algos = require('coinstac-distributed-algorithm-set');
var osr = algos.oneShotRegression;
var utils = algos.utils;

/**
 * @TODO change input to take x & y and minimize m
 */
var computeRegression = function(analysisInputs, analysisMeta) {
    var xVals = _.pluck(analysisInputs, 'predictors');
    var initialMVals = _.range(1, xVals[0].length + 1, 0);
    var yVals = _.pluck(analysisInputs, 'dependentVars');

    // @TODO dep vars (control/patient) must have both types
    var normalizedYVals = utils.normalize(yVals);
    var normalizedXVals = utils.normalize(xVals);

    var optimizedMVals = osr.minimize(initialMVals, normalizedXVals, normalizedYVals);

    var predictedYVals = osr.applyModel(optimizedMVals, normalizedXVals);

    var r2 = utils.r2(normalizedYVals, predictedYVals);

    return _.assign(
        {},
        _.zipObject(analysisMeta.predictors, optimizedMVals),
        { r2: r2}
    );
};

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

    return Promise.all(roiPromises).then(function(analysisInputs) {
        return computeRegression(analysisInputs, analysisMeta);
    });
};
