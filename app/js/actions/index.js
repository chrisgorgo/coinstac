/*
 * action types
 */
export const INIT = 'init';
export const INIT_BACKGROUND_SERVICES_START = 'INIT_BACKGROUND_SERVICES_START';
export const INIT_BACKGROUND_SERVICES_FINISH = 'INIT_BACKGROUND_SERVICES_FINISH';
export const PROJECT_FILE_CHANGE_CONTROL_TAG = 'PROJECT_FILE_CHANGE_CONTROL_TAG';
export const SET_CONSORTIA = 'SET_CONSORTIA';
export const SET_PROJECT = 'SET_PROJECT';
export const SET_PROJECT_CONSORTIUM_CTX = 'SET_PROJECT_CONSORTIUM_CTX';
export const SET_PROJECT_CONSORTIUM_ANALYSIS_CTX = 'SET_PROJECT_CONSORTIUM_ANALYSIS_CTX';
export const SET_USER = 'SET_USER';
export const SET_SIGNUP_USER = 'SET_SIGNUP_USER';

/*
 * action creators
 */
export function init() {
    return {type: INIT};
};

export function setConsortia(consortia) {
    return { type: SET_CONSORTIA, consortia };
};

export function setProject(project) {
    return { type: SET_PROJECT, project };
};

export function setProjectConsortiumCtx(consortium) {
    return { type: SET_PROJECT_CONSORTIUM_CTX, consortium };
};

export function setProjectConsortiumAnalysisCtx(analysisId) {
    return { type: SET_PROJECT_CONSORTIUM_ANALYSIS_CTX, analysisId };
};

export function setUser(user) {
    return { type: SET_USER, user };
};

export function setSignupUser(user) {
    return { type: SET_SIGNUP_USER, user };
};

export function initBackgroundServicesStart() {
    return { type: INIT_BACKGROUND_SERVICES_START };
};

export function initBackgroundServicesFinish() {
    return { type: INIT_BACKGROUND_SERVICES_FINISH };
};

/**
 * Change a project's file's `control` tag value.
 *
 * @param  {string}  projectId Stored project's ID
 * @param  {string}  fileSha   Stored file's SHA hash
 * @param  {boolean} tagValue  `true` if the file represents a control
 * @return {object}
 */
export function changeFileControlTag(projectId, fileSha, tagValue) {
    return {
        fileSha,
        projectId,
        type: PROJECT_FILE_CHANGE_CONTROL_TAG,
        value: tagValue,
    };
}
