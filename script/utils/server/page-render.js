import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import LayoutSwitch from '@views/layouts/LayoutSwitch';
import store from '@models/client/redux.config';


class pageRender {
  constructor(props, express) {
    this.pageList = props;
    const View = express.get('view');
    View.prototype.resolve = function resolve(dir, file) {
      return file;
    };
    express.set('view', View);
  }

  renderReact = (pageName, options, callback) => {
    try {
      const filePath = pageName.replace('.js', '');
      const Page = this.pageList[filePath];
      if (typeof (Page.getServerData) === 'function') {
        const newDefaultProps = Page.getServerData(options);
        const defaultProps = Page.defaultProps;
        if (!defaultProps) {
          Page.defaultProps = { ...newDefaultProps };
        } else {
          Page.defaultProps = { ...defaultProps, ...newDefaultProps };
        }
      }
      const content = renderToString(
        <MemoryRouter initialEntries={[{ pathname: filePath }]}>
          <Provider store={store}>
            <LayoutSwitch><Page /></LayoutSwitch>
          </Provider>
        </MemoryRouter>
      );

      const reactAppPath = process.env.NODE_ENV !== 'production' ? 'index.js' : '/javascripts/index.js';
      callback(null, `
        <html>
          <title>${options.title}</title>
          <link rel='stylesheet' href='/stylesheets/style.css' />
          <link rel='shortcut icon' href='/assets/favicon.ico'>
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
}

export default pageRender;