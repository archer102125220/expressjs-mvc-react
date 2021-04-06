import React from "react";
import { renderToString } from 'react-dom/server';

export default async function renderReact(filePath, options, callback) {
  try {
    // console.log(this.routeList);
    const { default:Page } = await import(filePath);
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
    callback(error)
  }
}