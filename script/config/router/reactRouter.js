import IndexPage from '@views';
import TestPage from '@views/testPage';

export const routeComponent = [
    { key: 'root', path: '/', exact: true, component: IndexPage, pageName: 'index' },
    { key: 'test', path: '/testPage', component: TestPage, pageName: 'testPage' },
];
export const redirectComponent = [
    { key: 'root', exact: true, to: '/', From: '/index' },
];
