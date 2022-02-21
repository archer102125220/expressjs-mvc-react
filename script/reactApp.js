import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
// import 'node_modules/plyr-react/dist/plyr.css'; // import plyr-react css
// import 'node_modules/video-react/dist/video-react.css'; // import video-react css
import 'node_modules/plyr/dist/plyr.css'; // import plyr-react css
import { store, BrowserHistory } from '@utils/client/reduxInit';
import Router from '@utils/client/reactRouterInit';
import reportWebVitals from '@utils/client/reportWebVitals';
import '@server/public/stylesheets/index.css';
import '@server/public/stylesheets/animista.css';

ReactDOM.render(
  // https://stackoverflow.com/questions/61220424/material-ui-drawer-finddomnode-is-deprecated-in-strictmode
  // <React.StrictMode>
  //   <Provider store={store}>
  //     <BrowserRouter>
  //       <Router history={BrowserHistory} />
  //     </BrowserRouter>
  //   </Provider>
  // </React.StrictMode>,

  <Provider store={store}>
    <BrowserRouter>
      <Router history={BrowserHistory} />
    </BrowserRouter>
  </Provider>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (process.env.NODE_ENV !== 'production') reportWebVitals(console.log);


// if (process.env.NODE_ENV === 'production') document.getElementById('__EXPRESS_MVC_REACT_DATA__').remove();
document.getElementById('__EXPRESS_MVC_REACT_DATA__').remove();