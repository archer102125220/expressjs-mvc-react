import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as reduxSagaEffects from 'redux-saga/effects';
import { connectRouter } from 'connected-react-router';
import * as historyCreater from 'history';
import { routerMiddleware as createRouterMiddleware } from 'connected-react-router';
import pluginModels from '@config/models/redux';

let history;
if (typeof (window) === 'object') {
  history = historyCreater.createBrowserHistory();
  history.listen(function (/*location, action*/) {
    const __PAGE_HEAD__ = document.querySelectorAll('.__EXPRESS_MVC_REACT_PAGE_HEAD__');
    __PAGE_HEAD__.forEach(element => {
      element.remove();
    });
    document.querySelector('title').innerText = serverData.defaultPageTitle;
  });
} else {
  history = historyCreater.createMemoryHistory();
}

export const BrowserHistory = history;

export const serverData = typeof (window) === 'object' ? JSON.parse(document.getElementById('__EXPRESS_MVC_REACT_DATA__').textContent) : {};


export default function reduxInit(pluginModels, serverReduxStore = {}) {
  // https://github.com/explooosion/react-redux-i18n-boilerplate/blob/master/src/reducers/settings.js
  // https://github.com/ms314006/React-With-Redux-Saga/blob/master/Ch02/src/saga/data.js

  let models = { router: connectRouter(history) };
  let mySagaList = [];
  pluginModels.map(element => {
    const { namespace, reducers, effects } = element;
    if (typeof (serverReduxStore[namespace]) === 'object') element.state = serverReduxStore[namespace];
    Object.keys(reducers).map(reducersKey => {
      reducers[`${namespace}/${reducersKey}`] = reducers[reducersKey];
    });
    if (typeof (effects) === 'object') {
      Object.keys(effects).forEach((effectsKey) => {
        if (effectsKey.includes('/')) {
          const key = effectsKey.split('/');
          if (`${key[0]}/${key[1]}` === effectsKey && key[0] === namespace) {
            return;
          }
        }
        effects[`${namespace}/${effectsKey}`] = function* (args) {
          yield effects[effectsKey](args, reduxSagaEffects);
        };
        function* mySaga() {
          yield reduxSagaEffects.takeEvery(`${namespace}/${effectsKey}`, effects[`${namespace}/${effectsKey}`]);
        }
        mySagaList.push(mySaga());
      });
    }

    models = {
      ...models, [namespace]: function (state = element.state, action) {
        const reducer = reducers[action.type] || (() => { });
        const newState = reducer(state, action) || state;
        return newState;
      }
    };
  });

  function* rootSaga() {
    yield reduxSagaEffects.all(mySagaList);
  }

  const composeEnhancers = typeof (window) === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
  const sagaMiddleware = createSagaMiddleware();
  const routerMiddleware = createRouterMiddleware();

  const store = createStore(
    combineReducers(models),
    composeEnhancers(applyMiddleware(sagaMiddleware, routerMiddleware))
  );

  sagaMiddleware.run(rootSaga);

  return store;
}

export const store = reduxInit(pluginModels, serverData.reduxStore);