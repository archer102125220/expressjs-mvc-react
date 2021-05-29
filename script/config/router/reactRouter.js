import IndexPage from '@views';

export const routeComponent = [
    { key: 'root', path: '/', exact: true, component: IndexPage, pageName: 'index' },
];
export const redirectComponent = [
    { key: 'root', exact: true, to: '/', From: '/index' },
];
