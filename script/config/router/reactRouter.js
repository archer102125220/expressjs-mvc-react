import IndexPage from '@views';
import LoginPage from '@views/Login';
import Player from '@views/video/_id';
import VideoList from '@views/video';
import Screenshot from '@views/video/Screenshot';
import Error from '@views/Error';

export const routeComponent = [
  { key: 'root', path: '/', exact: true, component: IndexPage, pageName: 'Index' },
  { key: 'login', path: '/login', component: LoginPage, pageName: 'Login' },
  { key: 'videoList', path: '/videos', exact: true, component: VideoList, pageName: 'Video_List', needToken: true, redirect: '/login' },
  { key: 'player', path: '/videos/player/:id', component: Player, pageName: 'Video_Player', needToken: true, redirect: '/login' },
  { key: 'screenshot', path: '/videos/screenshot', component: Screenshot, pageName: 'Video_Screenshot' },
];
export const redirectComponent = [
  { key: 'root', exact: true, to: '/', From: '/index' },
];
export const ErrorPage = Error;
