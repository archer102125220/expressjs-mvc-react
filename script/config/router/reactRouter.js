import IndexPage from '@views';
import LoginPage from '@views/Login';
import Player from '@views/video/Player';

export const routeComponent = [
  { key: 'root', path: '/', exact: true, component: IndexPage, pageName: 'Index' },
  { key: 'test', path: '/login', component: LoginPage, pageName: 'Login' },
  { key: 'test', path: '/video/player', component: Player, pageName: 'Video_Player' },
];
export const redirectComponent = [
  { key: 'root', exact: true, to: '/', From: '/index' },
];
