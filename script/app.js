import createError from 'http-errors';
import Express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import page_render from '@utils/server/page-render';
import JWTMiddleware from '@server/middlewares/JWT';
import { routesWeb, routesApi } from '@config/router/expressRouter';
//import uploader from '@server/middlewares/uploader';

class App extends Express {
  constructor(porps) {
    super(porps);

    this.createRenderFunction();
    this.setSetting();
    this.setMiddlewares();
    this.setRoutes();
    this.setErrorHandler();
  }

  middlewares = [
    logger('dev'),//將執行途中的狀態(如：errorMessage、warning等)console出來  https://andy6804tw.github.io/2017/12/27/middleware-tutorial/
    Express.json(),
    Express.urlencoded({ extended: false }),
    cookieParser(),//將cookie塞進controller的req物件裡面  http://expressjs.com/en/resources/middleware/cookie-parser.html
    Express.static(path.join(__dirname, 'public')), // https://expressjs.com/zh-tw/starter/static-files.html
    cors(),
    JWTMiddleware.unless({
      path: [
        '/',
        /^\/api\/users\/account\/.*/,
        '/api/users/registered',
        '/api/users/img_upload_test',
        '/api/users/video_upload_test',
        '/api/users/login',
        /^\/assets\/.*/,
        /^.*\.js/,
        /^.*\.css/
      ]
    }),
    //uploader.video(),
    //uploader.avater()
  ]

  setting = {
    'views': path.join(__dirname, 'views'),
    'view engine': 'js',
    'trust proxy': true
  }

  createRenderFunction = () => {
    const pageRender = new page_render(this);
    this.engine('js', pageRender.renderReact);
    this.response.render = pageRender.expandRender;
  }

  setSetting = () => {
    for (const key in this.setting) {
      this.set(key, this.setting[key]);
    }
  }

  setMiddlewares = () => {
    this.middlewares.forEach(element => {
      if (Array.isArray(element)) {
        this.use(element[0], element[1]);
      } else if (typeof (element) !== 'undefined') {
        this.use(element);
      }
    });

    if (process.env.NODE_ENV !== 'production') {
      const webpack = require('webpack');
      const webpackDevMiddleware = require('webpack-dev-middleware');
      // const webpackHotMiddleware = require('webpack-hot-middleware');
      const webpackConfig = require('./../webpack.config.client');
      const compilerWebpackConfig = webpack(webpackConfig);
      this.use(webpackDevMiddleware(compilerWebpackConfig, {
        stats: {
          colors: true
        }
      }));
      // this.use(webpackHotMiddleware(compilerWebpackConfig));
    }
  }

  setRoutes = () => {
    routesWeb.forEach(element => {
      this.use(element.prefix, element.route);
    });

    routesApi.forEach(element => {
      this.use('/api' + (element.prefix || ''), element.route);
    });
  }

  setErrorHandler = () => {

    // catch 404 and forward to error handler
    this.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    this.use(function (err, req, res) {
      let message = err.message;
      let payload = {};
      let status = err.status || 500;
      if (err.name === 'UnauthorizedError') {
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
        if (process.env.NODE_ENV !== 'production') {
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
