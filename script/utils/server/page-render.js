import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import _ from 'lodash';
import LayoutSwitch from '@views/layouts/LayoutSwitch';
import { store } from '@utils/client/reduxInit';
import { pageList } from '@config/router/expressRouter';
import { clientLinkTagList, clientScriptTagList, defaultPageTitle } from '@config/globalHeadTage';


class pageRender {
  constructor(express) {
    this.defaultPageTitle = express.defaultPageTitle || '';

    const View = express.get('view');
    View.prototype.pageList = this.pageList;
    View.prototype.resolve = this.resolve;
    express.set('view', View);

    const linkTagList = clientLinkTagList || [];
    this.clientLinkTag = linkTagList.reduce((accumulator, currentValue) => {
      accumulator += `<link ${Object.keys(currentValue).reduce((accumulator, currentValueKey) => {
        accumulator += `${currentValueKey}='${currentValue[currentValueKey]}' `;
        return accumulator;
      }, '')
        } />`;
      return accumulator;
    }, '');

    const scriptTagList = clientScriptTagList || [];
    this.clientScriptTag = scriptTagList.reduce((accumulator, currentValue) => {
      accumulator += `<script ${Object.keys(currentValue).reduce((accumulator, currentValueKey) => {
        accumulator += `${currentValueKey}='${currentValue[currentValueKey]}' `;
        return accumulator;
      }, '')
        } />`;
      return accumulator;
    }, '');
  }
  pageList = pageList

  renderReact = async (pageName, options, callback) => {
    try {
      const Page = this.pageList[pageName];
      let serverData = { pageName };

      let settings = _.cloneDeep(options.settings);
      delete options.settings;

      const res = _.cloneDeep(options.res);
      const req = _.cloneDeep(options.req);
      delete options.res;
      delete options.req;
      let serverPageProps = {};
      let serverProps = {};
      if (typeof (Page.getInitialProps) === 'function') {
        const newDefaultProps = await Page.getInitialProps({ serverData: options, settings, res, req, reduxStore: store, isServer: true });
        delete newDefaultProps.reduxStore;
        // settings = {};
        const defaultProps = Page.defaultProps;
        if (!defaultProps) {
          Page.defaultProps = { ...newDefaultProps };
        } else {
          Page.defaultProps = { ...defaultProps, ...newDefaultProps };
        }
        serverProps = Page.defaultProps;
        serverPageProps = { serverData: options, res: {}, req: {}, settings, isServer: false };
      } else {
        // settings = {};
        serverPageProps = { serverData: options, res: {}, req: {}, settings, isServer: false };
      }
      const content = renderToString(
        <MemoryRouter initialEntries={[{ pathname: pageName }]}>
          <Provider store={store}>
            <LayoutSwitch><Page /></LayoutSwitch>
          </Provider>
        </MemoryRouter>
      );

      serverData = { ...serverData, serverPageData: serverPageProps, reduxStore: store.getState(), serverProps };
      const reactAppPath = process.env.NODE_ENV !== 'production' ? 'index.js' : '/javascripts/index.js';
      const reactStylePath = process.env.NODE_ENV !== 'production' ? 'styles.css' : '/javascripts/styles.css';
      callback(null, `
        <html>
          <title>${defaultPageTitle || ''}</title>
          <script id="__EXPRESS_MVC_DATA__" type="application/json">${JSON.stringify(serverData)}</script>
          <link rel="stylesheet" type="text/css" href="${reactStylePath}" />
          ${this.clientLinkTag}
          ${this.clientScriptTag}
          <body>
            <div id="root">${content}</div>
          </body>
          <script src="${reactAppPath}"></script>
        </html>
      `);
    } catch (error) {
      callback(error);
    }
  }

  // node_modules\express\lib\response.js\render
  expandRender(view, options, callback, ...args) {
    const app = this.req.app;
    let done = callback;
    let opts = options || {};
    const req = this.req;
    const self = this;

    // support callback function as second arg
    if (typeof options === 'function') {
      done = options;
      opts = {};
    }

    // merge res.locals
    opts._locals = self.locals;

    // default callback to respond
    done = done || function (err, str) {
      if (err) return req.next(err);
      self.send(str);
    };

    opts = { ...opts, res: this, req };
    // render
    app.render(view, opts, done, ...args);
  }

  resolve(dir, file) {
    const pageName = file.replace('.js', '');
    if (this.pageList[pageName] !== undefined) {
      return pageName;
    }
  }
}

export default pageRender;