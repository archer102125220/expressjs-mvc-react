import createError from 'http-errors';
import Express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import indexRouter from '@/routes/index';
import usersRouter from '@/routes/users';
import JWTMiddleware from '@/middlewares/JWT';
//import uploader from '@/middlewares/uploader';

class App extends Express {
  constructor(porps) {
    super(porps);
    this.engine('react',(filePath, options, callback, a) => console.log(filePath, options, callback, a));
    this.init();
  }

  middlewares = [
    logger('dev'),//將執行途中的狀態(如：errorMessage、warning等)console出來  https://andy6804tw.github.io/2017/12/27/middleware-tutorial/
    Express.json(),
    Express.urlencoded({ extended: false }),
    cookieParser(),//將cookie塞進controller的req物件裡面  http://expressjs.com/en/resources/middleware/cookie-parser.html
    Express.static(path.join(__dirname, 'public')),//https://expressjs.com/zh-tw/starter/static-files.html
    cors(),
    JWTMiddleware.unless({ path: [
      '/',
      /^\/api\/users\/account\/.*/,
      '/api/users/registered',
      '/api/users/img_upload_test',
      '/api/users/video_upload_test',
      '/api/users/login'
    ]}),
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
    'view engine': 'ejs',
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
      element.route.stack.forEach(({ route }) => {
        const path = '/api' + ((route.path === element.prefix || route.path === '/') ? (element.prefix || '') : (element.prefix || '') + route.path);
        this.routeList.push(path);
      });
      this.use('/api' + (element.prefix || ''), element.route);
    });

    // catch 404 and forward to error handler
    this.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    this.use(function (err, req, res, next) {
      if(err.name === 'UnauthorizedError'){
        console.error('invalid token');
        res.status(401).send('invalid token');
        return;
      }
      // set locals, only providing error in development
        res.locals.message = err.message;
        console.log(err.message);
        //res.locals.error = req.app.get('env') === 'development' ? err : {};
        console.log(err.status);
        console.log(err.stack);

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  }

}

export default new App();
