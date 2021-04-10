import React from 'react';
import { renderToString } from 'react-dom/server';

class pageRender {
  constructor(props) {
    this.pageList = props;
    const $_this = this;
    const _renderReact = this.renderReact;
    this.renderReact = function(filePath, options, callback){
      _renderReact($_this, filePath, options, callback);
    };
  }
  renderReact = function($_this, path, options, callback){
    try {
      // console.log(this.routeList);
      const filePath = path.replace('\\index.js', '');
      const Page = $_this.pageList[filePath];
      if (typeof(Page.getServerData) === 'function') {
        if(!Page.defaultProps) {
          Page.defaultProps = {};
        }
        Page.getServerData(options);
      } else if(!Page.defaultProps) {
        Page.defaultProps = {...options};
      }
      const content = renderToString(<Page />);
      callback(null, `
        <html>
          <title>${options.title}</title>
          <link rel='stylesheet' href='/stylesheets/style.css' />
          <link rel='shortcut icon' href='/images/favicon.ico'>
          <body>
            <div id="root">${content}</div>
            <script src="/javascripts/client.js"></script>
          </body>
        </html>
      `);
    } catch (error) {
      callback(error);
    }
  }
}

export default pageRender;