/* globals __DEV__, __WEB__, window, HAS_REDUX_SAGA */

import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
// import { routerMiddleware, routerReducer } from 'react-router-redux';

import { rocConfig } from '../universal-config';

/**
 * Redux store creator
 *
 * @param {!object} reducers - Reducers that should be added to the store
 * @param {function[]} middlewares - Redux middlewares that should be added to the store
 * @param {function[]} enhancers - Redux enhancers that should be added to the store
 * @returns {function} A function that has the following interface:
 * `(callback) => (reduxReactRouter, getRoutes, createHistory, initialState)`.
 * The callback will be called when the application is in _DEV_ mode on the client as a way to add hot module update of
 * the reducers. The callback itself will take a function as the parameter that in turn takes the reducers to update.
 */
export default function createReduxStore(reducers, middlewares = [], enhancers = []) {
    return (callback) =>
        (history, initialState) => {
            let finalCreateStore;
            const normalMiddlewares = [].concat(middlewares);
            let sagaMiddleware;
            // redux-saga
            if (HAS_REDUX_SAGA) {
                const createSagaMiddleware = require('redux-saga').default; // eslint-disable-line
                sagaMiddleware = createSagaMiddleware();
                normalMiddlewares.push(sagaMiddleware);
            }

            // Add the react-router-redux middleware
            // normalMiddlewares.push(routerMiddleware(history));

            //initialise composeEnhancers as redux's default compose
            let composeEnhancers = compose;
            if (__DEV__ && __WEB__) {
                // const { persistState } = require('redux-devtools'); // eslint-disable-line
                const createLogger = require('redux-logger'); // eslint-disable-line
                const logger = createLogger({ ...rocConfig.dev.redux.logger });//TODO: make able to turn on and off

                const debugMiddlewares = [logger];

                // let devTools = (input) => input;
                if (rocConfig.dev.redux.devTools.enabled) {
                    // devTools = window.devToolsExtension
                    //     ? window.devToolsExtension()
                    //     // eslint-disable-next-line
                    //     : require('../../client/dev-tools').default.instrument(rocConfig.dev.redux.devTools.instrument);
                    // devTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
                    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
                }
                finalCreateStore = composeEnhancers(
                    applyMiddleware(...normalMiddlewares, ...debugMiddlewares),
                    // devTools,
                    // persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
                    ...enhancers
                )(createStore);
            } else {
                finalCreateStore = composeEnhancers(
                    applyMiddleware(...normalMiddlewares),
                    ...enhancers
                )(createStore);
            }
            // delete reducers['0'];
            const reducer = combineReducers({
                // routing: routerReducer,
                ...reducers,
            });
            const store = finalCreateStore(reducer, initialState);//<<Seomething about this is breaking
            // const store = createStore(reducer, initialState);//<<Temp fix
            if (__DEV__ && __WEB__ && module.hot) {
                // Enable Webpack hot module replacement for reducers
                callback((newReducers) => {
                    const nextRootReducer = combineReducers({
                        // routing: routerReducer,
                        ...newReducers,
                    });
                    store.replaceReducer(nextRootReducer);
                });
            }

            if (sagaMiddleware) {
                store.runSaga = sagaMiddleware.run;
            }

            return store;
        };
}
