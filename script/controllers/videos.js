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
    this.VideoScreenshot = new videoScreenshot('/video/screenshot');
  }

  videosListPage = async (req, res) => {
    const videos = await this.videosList(req, res);
    res.render('Video_Player', { videoList: JSON.parse(JSON.stringify(videos)) });
  }
  videosListAPI = async (req, res) => {
    const videos = await this.videosList(req, res);
    // if ((videos || []).length === 0) {
    //   res.status(200).json('查無資料');
    // }
    res.status(200).json(videos);
  }
  videosList = async (req, res) => {
    return await videoService.allVideos();
  }

  findVideo = async (req, res) => {
    const { account_Id, videoName } = req.payload;
    const owner = typeof (account_Id) === 'string' ? await UserService.findUser({ account_Id })[0].id : account_Id;
    const video = await videoService.findUser({ owner, videoName });
    if ((video || []).length === 0) {
      res.status(200).json('查無資料');
    }
    res.status(200).json(video);
  }

  videoUpload = async (req, res) => {
    const { body: payload } = req;
    const { videoOptionList: videoOptionListJSON } = payload;
    const videoOptionList = JSON.parse(videoOptionListJSON);
    const videoUploadList = req.file || req.files;
    // console.log(req.record);

    if (typeof (process.env.UPLOAD_VIDEO) !== 'string' || process.env.UPLOAD_VIDEO === '') {
      videoUploadList.forEach(element => {
        fs.unlink(element);
      });
      return res.status(501).send('影片上傳成功，但儲存失敗！');
    }
    this.VideoConverter.setEvent('onStart', async (video) => {
      const videoOutput = video.output.split('/');
      const videoName = videoOutput[videoOutput.length - 1];
      // await videoService.uploadVideo(videoName, req.auth.id);
    });
    const videoPathList = [];
    this.VideoConverter.setEvent('onComplete', async (video) => {
      videoPathList.push('/video/' + path.basename(video.output));
      if (videoUploadList.length === videoPathList.length) {
        const account = await UserService.findUser({ account: 'admin' });
        const token = JWTMiddleware.encode(account[0].dataValues);
        console.log({ videoPathList });
        await this.VideoScreenshot.getVideoScreenshop(videoPathList, token);
      }
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
    res.render('Video_Screenshot', { videoList: decodeURI(videoList).split(',') });
  }
}

export default new Videos();