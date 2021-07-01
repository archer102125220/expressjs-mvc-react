import IndexPage from '@views';
import LoginPage from '@views/Login';
import Player from '@views/video/Player';

export const routeComponent = [
  { key: 'root', path: '/', exact: true, component: IndexPage, pageName: 'index' },
  { key: 'test', path: '/login', component: LoginPage, pageName: 'login' },
  { key: 'test', path: '/video/player', component: Player, pageName: 'video_player' },
];
export const redirectComponent = [
  { key: 'root', exact: true, to: '/', From: '/index' },
];
