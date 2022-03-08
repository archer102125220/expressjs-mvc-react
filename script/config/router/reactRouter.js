import IndexPage from '@views';
import LoginPage from '@views/Login';
import Video_id from '@views/videos/_id';
import VideoList from '@views/videos';
import Screenshot from '@views/videos/Screenshot';
import Error from '@views/Error';

export const routeComponent = [
  { key: 'root', path: '/', exact: true, component: IndexPage, pageName: 'Index' },
  { key: 'login', path: '/login', component: LoginPage, pageName: 'Login' },
  { key: 'videoList', path: '/videos', exact: true, component: VideoList, pageName: 'Video_List', needToken: true, redirect: '/login' },
  { key: 'video_id', path: '/videos/player/:id', component: Video_id, pageName: 'Video_Player', needToken: true, redirect: '/login' },
  { key: 'screenshot', path: '/videos/screenshot', component: Screenshot, pageName: 'Video_Screenshot' },
];
export const redirectComponent = [
  { key: 'root', exact: true, to: '/', From: '/index' },
];
export const ErrorPage = Error;
