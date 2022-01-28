import IndexPage from '@views';
import LoginPage from '@views/Login';
import Player from '@views/video/_id';
import VideoList from '@views/video';
import Screenshot from '@views/video/Screenshot';

export const routeComponent = [
  { key: 'root', path: '/', exact: true, component: IndexPage, pageName: 'Index' },
  { key: 'login', path: '/login', component: LoginPage, pageName: 'Login' },
  { key: 'videoList', path: '/video', exact: true, component: VideoList, pageName: 'Video_List' },
  { key: 'player', path: '/video/:id', component: Player, pageName: 'Video_Player' },
  { key: 'screenshot', path: '/video/screenshot', component: Screenshot, pageName: 'Video_Screenshot' },
];
export const redirectComponent = [
  { key: 'root', exact: true, to: '/', From: '/index' },
];
