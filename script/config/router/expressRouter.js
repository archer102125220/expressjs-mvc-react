import Express from 'express';
import indexController from '@server/controllers/index';
import usersController from '@server/controllers/users';
import uploader from '@server/middlewares/uploader';
import IndexPage from '@views';
import ErrorPage from '@views/Error';
import LoginPage from '@views/Login';
import Player from '@views/video/Player';

class ExpressRouterConstructor {
  constructor() {
    this.routesWeb = {};
    this.routesApi = {};
    // https://blog.gtwang.org/programming/learn-to-use-the-new-router-in-expressjs-4/
    this.createRoutesWeb();
    this.createRoutesApi();
  }

  pageList = {
    'index': IndexPage,
    'error': ErrorPage,
    'login': LoginPage,
    'video_player': Player
  }

  createRoutesWeb = () => {
    const routesWeb = Express.Router();
    routesWeb.get('/', indexController.homePage);
    routesWeb.get('/login', indexController.login);
    routesWeb.get('/video/player', indexController.player);
    this.routesWeb = routesWeb;
  }
  createRoutesApi = () => {
    const routesApi = Express.Router();
    routesApi.get('/', indexController.homePageAPI);
    routesApi.get('/users', usersController.usersList);
    routesApi.post('/users/registered', uploader.avater(), usersController.createUser);
    routesApi.post('/users/img_upload_test', uploader.singleImg(), usersController.imgUploadTest);
    routesApi.post('/users/video_upload_test', uploader.arrayVideo(), usersController.videoUpload);
    // this.post('/users/video_upload_test', uploader.singleVideo(), usersController.videoUpload);
    routesApi.get('/users/account/:name', usersController.findUser);
    routesApi.post('/users/login', usersController.loginUser);
    this.routesApi = routesApi;
  }

}

const ExpressRouter = new ExpressRouterConstructor();

export default ExpressRouter;

export const routesWeb = ExpressRouter.routesWeb;

export const routesApi = ExpressRouter.routesApi;

export const pageList = ExpressRouter.pageList;
