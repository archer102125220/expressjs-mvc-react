import fs from 'fs';
import hbjs from 'handbrake-js';

export default class videoConverter {
  constructor(config = {}) {
    this.videoUploadList = config.videoUploadList;
    this.deleteOriginalVideo = config.deleteOriginalVideo || true;
    this.onStart = config.onStart;
    this.onProgress = config.onProgress;
    this.onComplete = config.onComplete;
    this.onError = config.onError;
  }

  convert = (videoUploadList) => {
    const videoList =
      videoUploadList ?
        (Array.isArray(videoUploadList) ? videoUploadList.map(this.handbrakeOption) : [this.handbrakeOption(videoUploadList)]) :
        (Array.isArray(this.videoUploadList) ? this.videoUploadList.map(this.handbrakeOption) : [this.handbrakeOption(this.videoUploadList)]);

    videoList.map((video) =>
      // https://liyaoli.com/2017-06-26/unhandled-promise-rejection.html
      // await hbjs
      //   .run({
      //     ...video,
      //     subtitle: 1,
      //     'subtitle-burned': 1
      //   })
      hbjs
        .spawn({
          ...video,
          subtitle: 1,
          'subtitle-burned': 1
        })
        .on('start', () => {
          console.log('video process start');
          // console.log({ start });
          if (typeof (this.onStart) === 'function') {
            this.onStart(video);
          }
        })
        .on('progress', progress => {
          // console.log(
          //   'Percent complete: %s, ETA: %s',
          //   progress.percentComplete,
          //   progress.eta
          // );
          if (typeof (this.onProgress) === 'function') {
            this.onProgress(progress, video);
          }
        })
        .on('complete', () => {
          if (typeof (this.onComplete) === 'function') {
            this.onComplete(video);
          }
          if (this.deleteOriginalVideo === true) {
            // https://www.geeksforgeeks.org/node-js-fs-unlinksync-method/
            fs.unlinkSync(video.input);
          }
          console.log('complete!');
        })
        .on('error', (err) => {
          if (typeof (this.onError) === 'function') {
            this.onError(err, video);
          }
          console.log({ err });
        })
    );
  }

  handbrakeOption = (video = {}) => {
    const videoFilename = video.filename || '_';
    const filename = videoFilename.substring(0, videoFilename.lastIndexOf('.')) + '.mp4';

    return {
      input: video.path,
      output: (video.destination || '').replace('/originalVideo', '') + '/' + filename
    };
  }
}

// export default new videoConverter();