import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import LayoutSwitch from '@utils/client/LayoutSwitch';


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
      // const defaultProps = Page.defaultProps;
      // if (!defaultProps) {
      //   Page.defaultProps = { ...options };
      // } else {
      //   Page.defaultProps = { ...defaultProps, ...options };
      // }
      if (typeof (Page.getServerData) === 'function') {
        Page.getServerData(options);
      }
      const content = renderToString(
        <MemoryRouter initialEntries={[ { pathname: filePath } ]}>
          <LayoutSwitch><Page /></LayoutSwitch>
        </MemoryRouter>
      );

      const reactAppPath = process.env.NODE_ENV === 'development' ? 'index.js' : '/javascripts/index.js';
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