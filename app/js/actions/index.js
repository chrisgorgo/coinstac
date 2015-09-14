/*
 * action types
 */
export const INIT = 'init';
export const SET_CONSORTIA = 'SET_CONSORTIA';
export const SET_PROJECT = 'SET_PROJECT';
export const SET_PROJECT_CONSORTIUM_CTX = 'SET_PROJECT_CONSORTIUM_CTX';
export const SET_PROJECT_CONSORTIUM_ANALYSIS_CTX = 'SET_PROJECT_CONSORTIUM_ANALYSIS_CTX';
export const SET_PROJECT_ANALYSES_BY_SHA = 'SET_PROJECT_ANALYSES_BY_SHA';
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

export function setProjectAnalysesBySha(analysesBySha) {
    return { type: SET_PROJECT_ANALYSES_BY_SHA, analysesBySha };
}
export function setUser(user) {
    return { type: SET_USER, user };
};

export function setSignupUser(user) {
    return { type: SET_SIGNUP_USER, user };
};
