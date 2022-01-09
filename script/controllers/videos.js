import fs from 'fs';
import videoConverter from '@utils/server/video-converter';
import videoService from '@services/server/videoService';
import UserService from '@services/server/userService';

class Videos {
  constructor() {
    this.VideoConverter = new videoConverter({ deleteOriginalVideo: true });
  }

  videosListPage = async (req, res) => {
    const videos = await this.videosList(req, res);
    res.render('Video_Player', { videoList: JSON.parse(JSON.stringify(videos)) });
  }
  videosListAPI = async (req, res) => {
    const videos = await this.videosList(req, res);
    if ((videoList || []).length === 0) {
      res.status(200).json('查無資料');
    }
    res.status(200).json(videos);
  }
  videosList = async (req, res) => {
    return await videoService.allVideos();
  }

  findVideo = async (req, res) => {
    const { account_Id, videoName } = req.payload;
    const owner = typeof (account_Id) === 'string' ? await UserService.findUser({ account_Id })[0].id : account_Id;
    const video = await UserService.findUser({ owner, videoName });
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
      await videoService.uploadVideo(videoName, req.auth.id);
    });


    this.VideoConverter.convert(videoUploadList, videoOptionList);

    // res.status(200).json({
    //   ...payload, videoUploadList, videoOptionList
    // });
    res.status(200).send('影片上傳成功！開始轉檔...');
  }
}

export default new Videos();