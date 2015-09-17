import {
    CONSORTIUM_RECIEVE,
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
    CONSORTIUM_ADD_RESULTS,
    CONSORTIUM_EDIT_RESULTS,
    CONSORTIUM_REMOVE_RESULTS,
} from '../actions/consortium';

export default function consortiumReducer(state = {
    analyses: [],
    description: '',
    error: '',
    isLoading: false,
    label: '',
    results: [],
    tags: [],
    users: [],
}, action) {
    let analyses;
    let results;
    let tags;
    switch (action.type) {
        case CONSORTIUM_RECIEVE:
            return Object.assign({}, state, action.consortium, {
                isLoading: false,
            });
        case CONSORTIUM_REQUEST:
            return Object.assign({}, state, { isLoading: true });
        case CONSORTIUM_FETCH_ERROR:
            return Object.assign({}, state, {
                error: action.error.message,
                isLoading: false,
            })
        case CONSORTIUM_ADD_USER:
            return Object.assign({}, state, {
                users: [...state.users, action.user],
            });
        case CONSORTIUM_REMOVE_USER:
            return Object.assign({}, state, {
                users: state.users.filter(user => user.id !== action.userId),
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
                if (tag.id === action.tagId) {
                    return action.tag;
                }
                return tag;
            });
            return Object.assign({}, state, { tags });
        case CONSORTIUM_REMOVE_TAG:
            return Object.assign({}, state, {
                tags: state.tags.filter(tag => tag.id !== action.tagId),
            });
        case CONSORTIUM_ADD_ANALYSIS:
            return Object.assign({}, state, {
                analyses: [...state.analyses, action.analyses],
            });
        case CONSORTIUM_EDIT_ANALYSIS:
            /** @todo  Confirm analyses' structure */
            analyses = state.analyses.map(analysis => {
                if (analyses.id === action.analysesId) {
                    return action.analyses;
                }
                return analyses;
            });
            return Object.assign({}, state, { analyses });
        case CONSORTIUM_REMOVE_ANALYSIS:
            analyses = state.analyses.filter(analysis => {
                return analyses.id !== action.analysesId;
            });
            return Object.assign({}, state, { analyses });
        case CONSORTIUM_ADD_RESULTS:
            return Object.assign({}, state, {
                results: [...state.results, action.results]
            });
        case CONSORTIUM_EDIT_RESULTS:
            /** @todo  Confirm shape of results object */
            results = state.results.map(result => {
                if (result.id === action.resultId) {
                    return action.result;
                }
                return result;
            });
            return Object.assign({}, state, { results });
        case CONSORTIUM_REMOVE_RESULTS:
            return Object.assign({}, state, {
                results: state.results.filter(result => {
                    return result.id !== action.resultId
                }),
            });
        default:
            return state;
    }
}
