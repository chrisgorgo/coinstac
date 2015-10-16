import consortia from './consortia';
import consortium from './consortium';
import signup from './signup';
import project from './project';
import login from './login'
import root from './root';

export default function reduceAppState(state = {}, action) {
    let newState = Object.assign(state, {
        consortia: consortia(state.consortia, action),
        consortium: consortium(state.consortium, action),
        signup: signup(state.signup, action),
        login: login(state.login, action),
        project: project(state.project, action)
    });

    return root(newState, action);
};
