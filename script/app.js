import createError from 'http-errors';
import Express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import page_render from '@utils/server/page-render';
import JWTMiddleware from '@middlewares/JWT';
import { routesWeb, routesApi } from '@config/router/expressRouter';
//import uploader from '@middlewares/uploader';
import swaggerFile from '@swagger_output'; // swagger-autogen輸出的 JSON

class App extends Express {
  constructor(porps) {
    super(porps);
    this.errorHandlers = [
      this.notFoundHandler,
      this.errorHandler
    ];

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
        '/login',
        /^\/assets\/.*/,
        /^.*\.js/,
        /^.*\.css/,
        '/api',
        '/api/',
        /^\/api\/users\/account\/.*/,
        '/api/users/registered',
        '/api/users/login'
      ]
    }),
    ['/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile)],
  ]

  setting = {
    'views': path.join(__dirname, 'views'),
    'view engine': 'js',
    'trust proxy': true
  }

  errorHandlers = []

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
        this.use(...element);
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
    this.use('/', routesWeb);
    this.use('/api', routesApi);
  }

  setErrorHandler = () => {
    this.errorHandlers.forEach(element => {
      if (typeof (element) !== 'undefined') {
        this.use(element);
      }
    });
  }

  // catch 404 and forward to error handler
  notFoundHandler = (req, res, next) => {
    // console.log(req.originalUrl);
    next(createError(404));
  }

  // error handler
  errorHandler = (err, req, res, next) => {
    if (!err) next();
    let message = err.message;
    let payload = {};
    let status = err.status || 500;
    if (err.name === 'UnauthorizedError') {
      if (req.originalUrl.includes('/api') === false && (typeof (req.auth) === 'undefined' || req.auth === null)) {
        return res.redirect('/login');
      }
      status = 401;
      message = 'invalid token';
    } else {
      console.log(err.status);
      console.log(err.stack);
    }
    // console.log(req.originalUrl);

    if (req.originalUrl.includes('/api')) {
      res.status(status).send(message);
    } else {
      // set locals, only providing error in development
      if (process.env.NODE_ENV !== 'production') {
        payload = { message, error: { ...err, err: err.toString() } };
      } else {
        payload = { message };
      }
      res.status(status);
      res.render('Error', payload);
    }
  }

}

export default new App();
