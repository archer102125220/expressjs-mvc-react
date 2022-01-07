import Express from 'express';
import indexController from '@server/controllers/index';
import usersController from '@server/controllers/users';
import videosController from '@server/controllers/videos';
import uploader from '@middlewares/uploader';
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
    'Index': IndexPage,
    'Error': ErrorPage,
    'Login': LoginPage,
    'Video_Player': Player
  }

  createRoutesWeb = () => {
    const routesWeb = Express.Router();
    routesWeb.get('/',
      /*
        #swagger.tags = ['web']
      */
      indexController.homePage);
    routesWeb.get('/login',
      /*
        #swagger.tags = ['web']
      */
      indexController.login);
    routesWeb.get('/video/player',
      /*
        #swagger.tags = ['web']
      */
      videosController.videosListPage);
    this.routesWeb = routesWeb;
  }
  createRoutesApi = () => {
    const routesApi = Express.Router();

    routesApi.get('/',
      /*
        #swagger.tags = ['api']
        #swagger.path = '/api'
      */
      indexController.homePageAPI);

    routesApi.get('/users',
      /*
        #swagger.tags = ['api', 'api/users']
        #swagger.path = '/api/users'
      */
      usersController.usersList);

    routesApi.post('/users/registered',
      /*
        #swagger.tags = ['api', 'api/users']
        #swagger.path = '/api/users/registered'
      */
      uploader.avater(), usersController.createUser);

    routesApi.post('/users/img_upload_test',
      /*
        #swagger.tags = ['api', 'api/users']
        #swagger.path = '/api/users/img_upload_test'
      */
      uploader.singleImg(), usersController.imgUploadTest);

    routesApi.post('/videos/upload',
      /*
        #swagger.tags = ['api', 'videos/upload']
        #swagger.path = '/api/videos/upload'
        #swagger.method = 'post'
        #swagger.description = 'Upload video and subtitle.'
        #swagger.consumes = 'multipart/form-data'
        #swagger.parameters['videoOptionList'] = {
          in: 'formData',
          type: 'txt',
          description: 'Upload video config.',
          example: '[{ originName: videoName, timestamp: Date.now(), newName: \'newName\', \'ssa-file\': subtitleName, \'ssa-burn\': 1 }]'
        }
        #swagger.parameters['video'] = {
          in: 'formData',
          type: 'array',
          items: { type: 'file' },
          description: 'Upload video and subtitle.'
        }
        #swagger.parameters['account_Id'] = {
          in: 'formData',
          type: 'txt',
          description: 'user UUID.',
          example: '5fa503d3-75d3-4577-bfb1-d9bd995541a9'
        }
        #swagger.responses[200] = {
          description: 'Upload complete and convert start.',
          schema: '檔案上傳成功！開始轉檔...',
        }
      */
      uploader.arrayVideo(), videosController.videoUpload);

    // this.post('/videos/upload', uploader.singleVideo(), videosController.videoUpload);
    routesApi.get('/users/account/:name',
      /*
        #swagger.tags = ['api', 'api/users']
        #swagger.path = '/api/users/account/:name'
        #swagger.method = 'get'
        #swagger.description = 'Query a user.'
        #swagger.parameters['name'] = {
          in: 'path',
          description: 'User name.' }
        #swagger.responses[200] = {
          description: 'User info.',
          schema: {}
        }
      */
      usersController.findUser);

    routesApi.post('/users/login',
      /*
        #swagger.tags = ['api', 'api/users']
        #swagger.path = '/api/users/login'
      */
      usersController.loginUser);


    routesApi.get('/videos',
      /*
        #swagger.tags = ['api', 'api/videos']
        #swagger.path = '/api/videos'
      */
      videosController.videosListAPI);

    this.routesApi = routesApi;
  }

}

const ExpressRouter = new ExpressRouterConstructor();

export default ExpressRouter;

export const routesWeb = ExpressRouter.routesWeb;

export const routesApi = ExpressRouter.routesApi;

export const pageList = ExpressRouter.pageList;
