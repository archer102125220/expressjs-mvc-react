import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, BrowserHistory } from '@utils/client/reduxInit';
import Router from '@utils/client/reactRouterInit';
import reportWebVitals from '@utils/client/reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Router history={BrowserHistory} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (process.env.NODE_ENV !== 'production') reportWebVitals(console.log);


// if (process.env.NODE_ENV === 'production') document.getElementById('__EXPRESS_MVC_DATA__').remove();
document.getElementById('__EXPRESS_MVC_DATA__').remove();