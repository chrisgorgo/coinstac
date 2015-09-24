/**
 * Store configuration.
 *
 * This configures the Redux store by adding middleware. See Redux's
 * 'Real World' example:
 *
 * @{@link  https://github.com/rackt/redux/blob/master/examples/real-world/store/configureStore.js}
 */
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import { default as authenticationMiddleware } from '../middleware/authentication';
import { default as consortiumMiddleware } from '../middleware/consortium';
import rootReducer from '../reducers';

const loggerMiddleware = createLogger({
    collapsed: true,
    level: 'info',
});

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    authenticationMiddleware,
    consortiumMiddleware,
    loggerMiddleware,
)(createStore);

export default function configureStore(initialState) {
    const store = createStoreWithMiddleware(rootReducer, initialState);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
