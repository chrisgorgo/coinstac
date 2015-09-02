import consortia from './consortia';
import signup from './signup';
import project from './project';
import login from './login'

export default function reduceAppState(state = {}, action) {
    return {
        consortia: consortia(state.consortia, action),
        signup: signup(state.signup, action),
        login: login(state.login, action),
        project: project(state.project, action),
        noop: function(state) { return state || {}; }
    };
};
