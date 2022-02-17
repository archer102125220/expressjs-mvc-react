const globalHeadTage = {
  defaultPageTitle: 'Cloud video',
  pageTitleTemplate: 'Cloud video - {{title}}', // or function (title) => { return title; }
  clientLinkTagList: [
    { rel: 'shortcut icon', href: '/assets/favicon.ico' },
  ],
  clientScriptTagList: [],
  clientMetaTagList: [
    { name: 'viewport', content: 'initial-scale=1.0, width=device-width' }
  ]
};


export default globalHeadTage;
export const clientLinkTagList = globalHeadTage.clientLinkTagList;
export const clientScriptTagList = globalHeadTage.clientScriptTagList;
export const clientMetaTagList = globalHeadTage.clientMetaTagList;
export const defaultPageTitle = globalHeadTage.defaultPageTitle;
export const pageTitleTemplate = globalHeadTage.pageTitleTemplate;
