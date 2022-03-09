import IndexPage from '@views';
import LoginPage from '@views/Login';
import Videos_id from '@views/videos/_id';
import Videos from '@views/videos';
import VideosScreenshot from '@views/videos/Screenshot';
import Error from '@views/Error';
import Users_id from '@views/users/_id';

export const routeComponent = [
  { key: 'root', path: '/', exact: true, component: IndexPage, pageName: 'Index' },
  { key: 'login', path: '/login', component: LoginPage, pageName: 'Login' },
  { key: 'videos', path: '/videos', exact: true, component: Videos, pageName: 'Videos', needToken: true, redirect: '/login' },
  { key: 'video_id', path: '/videos/player/:id', component: Videos_id, pageName: 'Videos_id', needToken: true, redirect: '/login' },
  { key: 'screenshot', path: '/videos/screenshot', component: VideosScreenshot, pageName: 'Videos_Screenshot' },
  { key: 'users_id', path: '/users/:id', exact: true, component: Users_id, pageName: 'Users_id', needToken: true, redirect: '/login' },
];
export const redirectComponent = [
  { key: 'root', exact: true, to: '/', From: '/index' },
];
export const ErrorPage = Error;
