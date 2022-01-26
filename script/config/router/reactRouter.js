import IndexPage from '@views';
import LoginPage from '@views/Login';
import Player from '@views/video/Player';
import Screenshot from '@views/video/Screenshot';

export const routeComponent = [
  { key: 'root', path: '/', exact: true, component: IndexPage, pageName: 'Index' },
  { key: 'login', path: '/login', component: LoginPage, pageName: 'Login' },
  { key: 'player', path: '/video/player', component: Player, pageName: 'Video_Player' },
  { key: 'screenshot', path: '/video/screenshot', component: Screenshot, pageName: 'Video_Screenshot' },
];
export const redirectComponent = [
  { key: 'root', exact: true, to: '/', From: '/index' },
];
