import fs from 'fs';
import path from 'path';
import Nightmare from 'nightmare';

export default class videoScreenshot {
  constructor(videoScreenshotURL = '', nightmareConfig = {}) {
    if (typeof (videoScreenshotURL) !== 'string' || videoScreenshotURL === '') throw 'init Error';
    const rootPath = process.cwd();
    const publicPath = rootPath + ((process.env.NODE_ENV !== 'production') ? '/script' : '/dist') + '/public';
    this.publicPath = publicPath;
    this.videoScreenshotURL = videoScreenshotURL;
    this.nightmareConfig = nightmareConfig;
  }

  getVideoScreent = async (videoList = [], token) => {
    if (videoList.length <= 0) throw 'video list is null';
    const nightmare = Nightmare({
      show: false,
      // openDevTools: {
      //   mode: 'detach'
      // },
      waitTimeout: 24 * 60 * 60 * 1000,
      ...this.nightmareConfig
    });
    const videoScreenshotURL = this.videoScreenshotURL;

    const videoScreenshotList = await nightmare
      .goto(
        `http://${'127.0.0.1:' + (process.env.APP_PORT || 80) + videoScreenshotURL + '?videoList=' + encodeURI(videoList.concat(','))}`,
        { Authorization: token }
      )
      .wait('#video-' + (videoList.length - 1).toString())
      .evaluate((selector, done) => {
        console.log('evaluate');
        const videoScreenshotList = [];
        const createVideoScreenshot = (video, key) => {
          const canvas = document.createElement('canvas');
          const canvasFill = canvas.getContext('2d');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvasFill.drawImage(video, 0, 0, canvas.width, canvas.height);
          const videoScreenshot = canvas.toDataURL('image/png');
          videoScreenshotList[key] = videoScreenshot.replace(/^data:image\/\w+;base64,/, '');

          if (videoScreenshotList.length === document.querySelectorAll('video').length) {
            done(null, videoScreenshotList);
          }
        }

        document.querySelectorAll(selector).forEach((videoElement, index) => {
          videoElement.onloadeddata = (e) => setTimeout(createVideoScreenshot(e.target, index), 1000);
        });

      }, 'video')
      .end();
    videoScreenshotList.forEach((videoScreenshot, index) => {
      const buf = Buffer.from(videoScreenshot, 'base64');
      const videoName = path.basename(videoList[index], path.extname(videoList[index]));
      const dirname = path.dirname(videoList[index]);
      console.log(this.publicPath + dirname + '/screenshot/' + videoName + '.png');
      fs.writeFileSync(this.publicPath + dirname + '/screenshot/' + videoName + '.png', buf);
    });
  }

}