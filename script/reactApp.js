import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as history from 'history';
import { Provider } from 'react-redux';
import Router from '@utils/client/router';
import reportWebVitals from '@utils/client/reportWebVitals';
import store from '@models/client/redux.config';

const BrowserHistory = history.createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Router history={BrowserHistory} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  // <React.StrictMode>
  //   <BrowserRouter>
  //     <Router history={BrowserHistory} />
  //   </BrowserRouter>
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (process.env.NODE_ENV !== 'production') reportWebVitals(console.log);
