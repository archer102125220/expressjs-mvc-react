import createError from 'http-errors';
import Express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import renderReact from '@/utils/server/render-react';
import indexRouter from '@server/routes/index';
import usersRouter from '@server/routes/users';
import JWTMiddleware from '@server/middlewares/JWT';
//import uploader from '@server/middlewares/uploader';

class App extends Express {
  constructor(porps) {
    super(porps);
    this.renderReact = renderReact.bind(this);
    this.engine('js', this.renderReact);
    this.init();
  }

  middlewares = [
    logger('dev'),//將執行途中的狀態(如：errorMessage、warning等)console出來  https://andy6804tw.github.io/2017/12/27/middleware-tutorial/
    Express.json(),
    Express.urlencoded({ extended: false }),
    cookieParser(),//將cookie塞進controller的req物件裡面  http://expressjs.com/en/resources/middleware/cookie-parser.html
    Express.static(path.join(__dirname, 'public')),//https://expressjs.com/zh-tw/starter/static-files.html
    cors(),
    JWTMiddleware.unless({
      path: [
        '/',
        /^\/api\/users\/account\/.*/,
        '/api/users/registered',
        '/api/users/img_upload_test',
        '/api/users/video_upload_test',
        '/api/users/login'
      ]
    }),
    //uploader.video(),
    //uploader.avater()
  ]

  routesWeb = [
    { prefix: '/', route: indexRouter },
  ]

  routesApi = [
    { prefix: '/users', route: usersRouter }
  ]

  routeList = []

  setting = {
    'views': path.join(__dirname, 'views'),
    'view engine': 'js',
    'trust proxy': true
  }

  init = () => {
    for (const key in this.setting) {
      this.set(key, this.setting[key]);
    }

    this.middlewares.forEach(element => {
      if (Array.isArray(element)) {
        this.use(element[0], element[1]);
      } else if (typeof (element) !== 'undefined') {
        this.use(element);
      }
    });

    this.routesWeb.forEach(element => {
      element.route.stack.forEach(({ route }) => {
        const path = (route.path === element.prefix || route.path === '/') ? element.prefix : element.prefix + route.path;
        this.routeList.push(path);
      });
      this.use(element.prefix, element.route);
    });

    this.routesApi.forEach(element => {
      // element.route.stack.forEach(({ route }) => {
      //   const path = '/api' + ((route.path === element.prefix || route.path === '/') ? (element.prefix || '') : (element.prefix || '') + route.path);
      //   this.routeList.push(path);
      // });
      this.use('/api' + (element.prefix || ''), element.route);
    });

    // catch 404 and forward to error handler
    this.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    this.use(function (err, req, res, next) {
      let message = err.message;
      let payload = {};
      let status = err.status || 500;
      if(err.name === 'UnauthorizedError') {
        status = 401;
        message = 'invalid token';
      } else {
        console.log(err.status);
        console.log(err.stack);
      }

      if (req.originalUrl.includes('/api')) {
        res.status(status).send(message);
      } else {
        // set locals, only providing error in development
        if (process.env.NODE_ENV === 'development') {
          payload = { message, error: err };
        } else {
          payload = { message };
        }
        res.status(status);
        res.render('error', payload);
      }
    });
  }

}

export default new App();
