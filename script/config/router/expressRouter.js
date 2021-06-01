import indexRouter from '@server/controllers/index';
import usersRouter from '@server/controllers/users';
import IndexPage from '@views';
import ErrorPage from '@views/error';

export const routesWeb = [
  { prefix: '/', route: indexRouter },
];

export const routesApi = [
  { prefix: '/users', route: usersRouter }
];

export const pageList = {
  'index': IndexPage,
  'error': ErrorPage
};
