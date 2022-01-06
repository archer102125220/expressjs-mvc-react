import fs from 'fs';
import videoConverter from '@utils/server/video-converter';
import videoService from '@services/server/videoService';

class Videos {
  constructor() {
    this.VideoConverter = new videoConverter({ deleteOriginalVideo: true });
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
      await videoService.uploadVideo(video.output, req.auth.id);
    });


    this.VideoConverter.convert(videoUploadList, videoOptionList);

    // res.status(200).json({
    //   ...payload, videoUploadList, videoOptionList
    // });
    res.status(200).send('影片上傳成功！開始轉檔...');
  }
}

export default new Videos();