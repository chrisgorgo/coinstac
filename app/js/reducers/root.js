import {
    INIT_BACKGROUND_SERVICES_START,
    INIT_BACKGROUND_SERVICES_FINISH
} from '../actions/';

export default function consortiumReducer(state, action) {

    switch (action.type) {
        case INIT_BACKGROUND_SERVICES_START:
            return Object.assign({}, state, { ui_backgroundServicesLoading: true });
        case INIT_BACKGROUND_SERVICES_FINISH:
            let nState = Object.assign({}, state);
            delete nState.ui_backgroundServicesLoading;
            return nState;
        default:
            return state;
    }
}
