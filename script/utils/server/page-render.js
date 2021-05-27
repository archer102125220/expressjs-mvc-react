import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import _ from 'lodash';
import LayoutSwitch from '@views/layouts/LayoutSwitch';
import store from '@models/client/redux.config';


class pageRender {
  constructor(express) {
    this.pageList = express.pageList;
    this.defaultPageTitle = express.defaultPageTitle || '';

    const View = express.get('view');
    View.prototype.pageList = this.pageList;
    View.prototype.resolve = this.resolve;
    express.set('view', View);

    const clientLinkTagList = express?.clientLinkTagList || [];
    this.clientLinkTag = clientLinkTagList.reduce((accumulator, currentValue) => {
      accumulator += `<link ${Object.keys(currentValue).reduce((accumulator, currentValueKey) => {
        accumulator += `${currentValueKey}='${currentValue[currentValueKey]}' `;
        return accumulator;
      }, '')
        } />`;
      return accumulator;
    }, '');

    const clientScriptTagList = express?.clientScriptTagList || [];
    this.clientScriptTag = clientScriptTagList.reduce((accumulator, currentValue) => {
      accumulator += `<script ${Object.keys(currentValue).reduce((accumulator, currentValueKey) => {
        accumulator += `${currentValueKey}='${currentValue[currentValueKey]}' `;
        return accumulator;
      }, '')
        } />`;
      return accumulator;
    }, '');
  }

  renderReact = (pageName, options, callback) => {
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
      if (typeof (Page.getServerData) === 'function') {
        const newDefaultProps = Page.getServerData({ serverData: options, settings, res, req, serverReduxStore: store, isServer: true });
        delete newDefaultProps.reduxStore;
        // settings = {};
        const defaultProps = Page.defaultProps;
        if (!defaultProps) {
          Page.defaultProps = { ...newDefaultProps };
        } else {
          Page.defaultProps = { ...defaultProps, ...newDefaultProps };
        }
        serverPageProps = { ...Page.defaultProps, serverData: options, res: {}, req: {}, settings, isServer: false };
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

      serverData = { ...serverData, serverPageProps, serverReduxStore: store.getState() };
      const reactAppPath = process.env.NODE_ENV !== 'production' ? 'index.js' : '/javascripts/index.js';
      callback(null, `
        <html>
          <title>${this.defaultPageTitle}</title>
          <script id="__EXPRESS_MVC_DATA__" type="application/json">${JSON.stringify(serverData)}</script>
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