import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import reduxSaga from 'redux-saga';
import * as reduxSagaEffects from 'redux-saga/effects';

const pluginModels = [require('./userList').default];

function reduxInit(pluginModels) {
  // https://github.com/explooosion/react-redux-i18n-boilerplate/blob/master/src/reducers/settings.js
  // https://github.com/ms314006/React-With-Redux-Saga/blob/master/Ch02/src/saga/data.js

  let models = {};
  let mySagaList = [];
  pluginModels.map(element => {
    const { namespace, reducers, effects } = element;
    Object.keys(reducers).map(reducersKey => {
      reducers[`${namespace}/${reducersKey}`] = reducers[reducersKey];
    });
    if (typeof (effects) === 'object') {
      Object.keys(effects).map((effectsKey) => {
        effects[`${namespace}/${effectsKey}`] = function* (args) {
          yield effects[effectsKey](args, { ...reduxSaga, ...reduxSagaEffects });
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

  const composeEnhancers = typeof(window) === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
  const sagaMiddleware = reduxSaga();

  const store = createStore(
    combineReducers(models),
    composeEnhancers(applyMiddleware(sagaMiddleware))
  );

  sagaMiddleware.run(rootSaga);

  return store;
}

export default reduxInit(pluginModels);