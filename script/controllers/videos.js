import fs from 'fs';
import path from 'path';
import videoConverter from '@utils/server/video-converter';
import videoScreenshot from '@utils/server/video-screenshot';
import videoService from '@services/server/videoService';
import UserService from '@services/server/userService';
import JWTMiddleware from '@middlewares/JWT';

class Videos {
  constructor() {
    this.VideoConverter = new videoConverter({ deleteOriginalVideo: true });
    this.VideoScreenshot = new videoScreenshot('/videos/screenshot');
    UserService.findUser({ account: 'admin' }).then(account => this.adminData = account[0].dataValues);
  }

  videosListPage = async (req, res) => {
    const videos = await this.videosList(req, res);
    res.render('Videos', { videoList: JSON.parse(JSON.stringify(videos)) });
  }
  videosListAPI = async (req, res) => {
    const videos = await this.videosList(req, res);
    // if ((videos || []).length === 0) {
    //   res.status(200).json('查無資料');
    // }
    res.status(200).json(videos);
  }
  videosList = async (req) => {
    const { videoName } = req.query;
    if (typeof (videoName) === 'string') {
      return await videoService.findVideoList(videoName);
    }
    return await videoService.allVideos();
  }

  videoListPage = async (req, res) => {
    const videos = await this.videoList(req, res);
    res.render('Videos', { videoListInfo: JSON.parse(JSON.stringify(videos)) });
  }
  videoListAPI = async (req, res) => {
    const videos = await this.videoList(req, res);
    // if ((videos || []).length === 0) {
    //   res.status(200).json('查無資料');
    // }
    res.status(200).json({ videoListInfo: JSON.parse(JSON.stringify(videos)) });
  }
  videoList = async (req) => {
    const { id } = req.params;
    return await videoService.findVideoList({ id });
  }


  playVideoPage = async (req, res) => {
    const video = await this.playVideo(req, res);
    res.render('Videos_id', { videoInfo: JSON.parse(JSON.stringify(video)) });
  }
  playVideoAPI = async (req, res) => {
    const video = await this.playVideo(req, res);
    // if (typeof (video) !== 'object' || video === null) {
    //   res.status(200).json('查無資料');
    // }
    res.status(200).json(video);
  }
  playVideo = async (req) => {
    // const { user_Id, videoName } = req.payload;
    const { id } = req.params;
    const user_Id = req.query.user_Id || req.auth.id;
    const owner = typeof (user_Id) === 'string' ? await UserService.findUser({ account_Id: user_Id })[0].id : user_Id;
    return await videoService.findVideo({ id }, owner);
  }

  videoUpload = async (req, res) => {
    const { body: payload } = req;
    const { videoOptionList: videoOptionListJSON } = payload;
    const videoOptionList = JSON.parse(videoOptionListJSON);
    const videoUploadList = req.file || req.files;

    if (typeof (process.env.UPLOAD_VIDEO) !== 'string' || process.env.UPLOAD_VIDEO === '') {
      videoUploadList.forEach(element => {
        fs.unlink(element);
      });
      return res.status(501).send('影片上傳成功，但儲存失敗！');
    }
    this.VideoConverter.setEvent('onStart', async (video) => {
      const videoOutput = video.output.split('/');
      const videoName = videoOutput[videoOutput.length - 1];
      await videoService.uploadVideo(videoName, req.auth.id);
    });
    this.VideoConverter.setEvent('onComplete', async (video) => {
      const videoOutput = video.output.split('/');
      const videoName = videoOutput[videoOutput.length - 1];
      const videoNameArray = videoName.split('_-_');
      const videoScreenshotName = videoNameArray[0] + '_-_' + videoNameArray[1] + '_-_' + Date.now();
      await this.VideoScreenshot.getVideoScreent(['/' + process.env.UPLOAD_VIDEO + '/' + path.basename(video.output)], [videoScreenshotName], JWTMiddleware.encode(this.adminData));
      await videoService.saveScreenshot(videoName, '/' + process.env.UPLOAD_VIDEO + '/screenshot/' + videoScreenshotName + '.png');
    });


    this.VideoConverter.convert(videoUploadList, videoOptionList);

    // res.status(200).json({
    //   ...payload, videoUploadList, videoOptionList
    // });
    res.status(200).send('影片上傳成功！開始轉檔...');
  }
  videoScreenPage = async (req, res) => {
    if (req.auth.account !== 'admin') return res.status(401);
    const { videoList } = req.query;
    const account = await UserService.findUser({ account: 'admin' });
    const token = JWTMiddleware.encode(account[0].dataValues);
    res.cookie('token', token, { httpOnly: true });
    res.render('Videos_Screenshot', { videoList: decodeURI(videoList).split(',') });
  }
}

export default new Videos();