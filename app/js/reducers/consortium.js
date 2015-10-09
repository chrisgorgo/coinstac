import {
    CONSORTIUM_RECEIVE,
    CONSORTIUM_REQUEST,
    CONSORTIUM_FETCH_ERROR,
    CONSORTIUM_ADD_USER,
    CONSORTIUM_REMOVE_USER,
    CONSORTIUM_EDIT_LABEL,
    CONSORTIUM_EDIT_DESCRIPTION,
    CONSORTIUM_ADD_TAG,
    CONSORTIUM_EDIT_TAG,
    CONSORTIUM_REMOVE_TAG,
    CONSORTIUM_ADD_ANALYSIS,
    CONSORTIUM_EDIT_ANALYSIS,
    CONSORTIUM_REMOVE_ANALYSIS,
    CONSORTIUM_ADD_RESULT,
    CONSORTIUM_EDIT_RESULT,
    CONSORTIUM_REMOVE_RESULT,
    CONSORTIUM_RESULTS_RECEIVE,
    CONSORTIUM_RESULTS_REQUEST,
} from '../actions/consortium';

export default function consortiumReducer(state = {
    analyses: [],
    description: '',
    label: '',
    ui_results: [],
    tags: [],
    ui_error: '',
    ui_isLoading: false,
    users: [],
}, action) {
    let analyses;
    let tags;
    switch (action.type) {
        case CONSORTIUM_RECEIVE:
            return Object.assign({}, state, action.consortium, {
                ui_isLoading: false,
            });
        case CONSORTIUM_REQUEST:
            return Object.assign({}, state, { ui_isLoading: true });
        case CONSORTIUM_FETCH_ERROR:
            return Object.assign({}, state, {
                ui_error: action.error.message,
                ui_isLoading: false,
            })
        case CONSORTIUM_ADD_USER:
            return Object.assign({}, state, {
                users: [...state.users, action.user],
            });
        case CONSORTIUM_REMOVE_USER:
            return Object.assign({}, state, {
                users: state.users.filter(user => {
                    return user.username !== action.username;
                }),
            });
        case CONSORTIUM_EDIT_LABEL:
            return Object.assign({}, state, {
                label: action.label,
            });
        case CONSORTIUM_EDIT_DESCRIPTION:
            return Object.assign({}, state, {
                description: action.description,
            });
        case CONSORTIUM_ADD_TAG:
            return Object.assign({}, state, {
                tags: [...state.tags, action.tag],
            });
        case CONSORTIUM_EDIT_TAG:
            /** @todo  Confirm tag's object design */
            tags = state.tags.map(tag => {
                if (tag.id === action.id) {
                    return action.tag;
                }
                return tag;
            });
            return Object.assign({}, state, { tags });
        case CONSORTIUM_REMOVE_TAG:
            return Object.assign({}, state, {
                tags: state.tags.filter(tag => tag.id !== action.id),
            });
        case CONSORTIUM_ADD_ANALYSIS:
            return Object.assign({}, state, {
                analyses: [...state.analyses, action.analysis],
            });
        case CONSORTIUM_EDIT_ANALYSIS:
            /** @todo  Confirm analyses' structure */
            analyses = state.analyses.map(analysis => {
                if (analysis.id === action.id) {
                    return action.analyses;
                }
                return analyses;
            });
            return Object.assign({}, state, { analyses });
        case CONSORTIUM_REMOVE_ANALYSIS:
            analyses = state.analyses.filter(analysis => {
                return analysis.id !== action.id;
            });
            return Object.assign({}, state, { analyses });
        case CONSORTIUM_ADD_RESULT:
            return Object.assign({}, state, {
                ui_results: [...state.ui_results, action.result],
            });
        case CONSORTIUM_EDIT_RESULT:
            return Object.assign({}, state, {
                ui_results: state.ui_results.map(result => {
                    if (result._id === action.id) {
                        return action.result;
                    }
                    return result;
                }),
             });
        case CONSORTIUM_REMOVE_RESULT:
            return Object.assign({}, state, {
                ui_results: state.ui_results.filter(result => {
                    return result._id !== action.id
                }),
            });

        case CONSORTIUM_RESULTS_RECEIVE:
            return Object.assign({}, state, {
                ui_results: action.results,
            });
        default:
            return state;
    }
}
