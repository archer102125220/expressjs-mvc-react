import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import _ from 'lodash';
import { parse } from 'node-html-parser';
import { ServerStyleSheets } from '@material-ui/core/styles';
import LayoutSwitch from '@views/layouts/LayoutSwitch';
import { store } from '@utils/client/reduxInit';
import { pageList } from '@config/router/expressRouter';
import { clientLinkTagList, clientScriptTagList, defaultPageTitle, clientMetaTagList, pageTitleTemplate } from '@config/globalHeadTage';


class pageRender {
  constructor(express) {
    const View = express.get('view');
    View.prototype.pageList = this.pageList;
    View.prototype.resolve = this.resolve;
    express.set('view', View);

    const linkTagList = clientLinkTagList || [];
    this.clientLinkTag = this.tegCreate(linkTagList, 'link');
    // this.clientLinkTag = linkTagList.reduce((accumulator, currentValue) => {
    //   accumulator += `<link ${Object.keys(currentValue).reduce((accumulator, currentValueKey) => {
    //     accumulator += `${currentValueKey}='${currentValue[currentValueKey]}' `;
    //     return accumulator;
    //   }, '')
    //     } />`;
    //   return accumulator;
    // }, '');

    const scriptTagList = clientScriptTagList || [];
    this.clientScriptTag = this.tegCreate(scriptTagList, 'script');
    // this.clientScriptTag = scriptTagList.reduce((accumulator, currentValue) => {
    //   accumulator += `<script ${Object.keys(currentValue).reduce((accumulator, currentValueKey) => {
    //     accumulator += `${currentValueKey}='${currentValue[currentValueKey]}' `;
    //     return accumulator;
    //   }, '')
    //     } />`;
    //   return accumulator;
    // }, '');

    const metaTagList = clientMetaTagList || [];
    this.clientMetaTag = this.tegCreate(metaTagList, 'meta');
  }
  pageList = pageList

  renderReact = async (pageName, options, callback) => {
    try {
      const Page = this.pageList[pageName];
      let serverData = { pageName, defaultPageTitle };

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

        if (typeof (newDefaultProps) === 'object' && newDefaultProps !== null) {
          if (typeof (newDefaultProps.reduxStore) === 'object' && newDefaultProps.reduxStore !== null) delete newDefaultProps.reduxStore;
          // settings = {};
          const WrappedComponent = Page?.WrappedComponent;
          if (WrappedComponent) {
            const WrappedComponentDefaultProps = WrappedComponent?.defaultProps || {};
            Page.WrappedComponent.defaultProps = { ...WrappedComponentDefaultProps, ...newDefaultProps };
            Page.defaultProps = Page.WrappedComponent.defaultProps;
            serverProps = Page.WrappedComponent.defaultProps;
          } else {
            const defaultProps = Page?.defaultProps || {};
            Page.defaultProps = { ...defaultProps, ...newDefaultProps };
            serverProps = Page.defaultProps;
          }
          serverPageProps = { serverData: options, res: {}, req: {}, settings, isServer: false };
        }
      } else {
        // settings = {};
        serverPageProps = { serverData: options, res: {}, req: {}, settings, isServer: false };
      }
      const sheets = new ServerStyleSheets();
      const content = renderToString(
        sheets.collect(
          <MemoryRouter initialEntries={[{ pathname: pageName }]}>
            <Provider store={store}>
              <LayoutSwitch><Page /></LayoutSwitch>
            </Provider>
          </MemoryRouter>
        )
      );
      const cssString = sheets.toString();

      const dom = parse(content);
      const domTitle = dom.querySelectorAll('title');
      const pageTitleBeforTemplate = (domTitle[domTitle.length - 1]?.childNodes || [])[0]?.rawText || defaultPageTitle;
      const pageTitleAfterTemplate = (typeof (pageTitleTemplate) === 'string') ? pageTitleTemplate.replace('{{title}}', pageTitleBeforTemplate) : pageTitleTemplate(pageTitleBeforTemplate);
      const pageTitle = (typeof (pageTitleAfterTemplate) !== 'string' || pageTitleAfterTemplate === '') ? defaultPageTitle : pageTitleAfterTemplate;
      const domTitleCount = domTitle.length;
      for (let i = 0; i < domTitleCount; i++) {
        domTitle[i].remove();
      }

      const domMeta = dom.querySelectorAll('meta');
      const domMetaCount = domMeta.length;
      let pageMeta = '';
      for (let i = 0; i < domMetaCount; i++) {
        domMeta[i].classList.add('__EXPRESS_MVC_REACT_PAGE_HEAD__');
        domMeta[i].classList.add('__SSR__');
        pageMeta += domMeta[i].toString();
        domMeta[i].remove();
      }

      const domLink = dom.querySelectorAll('link');
      const domLinkCount = domLink.length;
      let pageLink = '';
      for (let i = 0; i < domLinkCount; i++) {
        domLink[i].classList.add('__EXPRESS_MVC_REACT_PAGE_HEAD__');
        domLink[i].classList.add('__SSR__');
        pageLink += domLink[i].toString();
        domLink[i].remove();
      }

      const domScript = dom.querySelectorAll('script');
      const domScriptCount = domScript.length;
      let pageScript = '';
      for (let i = 0; i < domScriptCount; i++) {
        domScript[i].classList.add('__EXPRESS_MVC_REACT_PAGE_HEAD__');
        domScript[i].classList.add('__SSR__');
        pageScript += domScript[i].toString();
        domScript[i].remove();
      }

      const domStyle = dom.querySelectorAll('style');
      const domStyleCount = domStyle.length;
      let pageStyle = '';
      for (let i = 0; i < domStyleCount; i++) {
        domStyle[i].classList.add('__EXPRESS_MVC_REACT_PAGE_HEAD__');
        domStyle[i].classList.add('__SSR__');
        pageStyle += domStyle[i].toString();
        domStyle[i].remove();
      }

      serverData = { ...serverData, serverPageData: serverPageProps, reduxStore: store.getState(), serverProps };
      const reactAppPath = process.env.NODE_ENV !== 'production' ? '/index.js' : '/javascripts/index.js';
      const reactModulesPath = process.env.NODE_ENV !== 'production' ? '/modules.js' : '/javascripts/modules.js';
      const reactStylePath = process.env.NODE_ENV !== 'production' ? '/styles.css' : '/javascripts/styles.css';
      const reactModuleStylesPath = process.env.NODE_ENV !== 'production' ? '/modules.css' : '/javascripts/modules.css';
      callback(null, `
        <html>
          <title>${pageTitle || ''}</title>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <link rel="stylesheet" type="text/css" href="${reactModuleStylesPath}" />
          <script src="${reactModulesPath}" async></script>
          <script id="__EXPRESS_MVC_REACT_DATA__" type="application/json">${JSON.stringify(serverData)}</script>
          <link rel="stylesheet" type="text/css" href="${reactStylePath}" />
          <style id="__EXPRESS_MVC_REACT_SSR_CSS__">${cssString}</style>
          ${this.clientLinkTag} ${this.clientScriptTag} ${this.clientMetaTag} ${pageMeta} ${pageLink} ${pageScript} ${pageStyle}
          <body>
            <div id="root">${dom.toString()}</div>
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

  tegCreate = (tageList, tageName) => {
    return tageList.reduce((accumulator, currentValue) => {
      accumulator += `<${tageName} ${Object.keys(currentValue).reduce((accumulator, currentValueKey) => {
        accumulator += `${currentValueKey}='${currentValue[currentValueKey]}' `;
        return accumulator;
      }, '')
        } />`;
      return accumulator;
    }, '');
  }
}

export default pageRender;