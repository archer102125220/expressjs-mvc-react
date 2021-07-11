import fs from 'fs';
import hbjs from 'handbrake-js';

export default class videoConverter {
  constructor(config = {}) {
    this.videoUpload = config.videoUpload;
    this.deleteOriginalVideo = config.deleteOriginalVideo || true;
    this.onStart = config.onStart;
    this.onProgress = config.onProgress;
    this.onComplete = config.onComplete;
    this.onError = config.onError;
  }

  convert = (videoUpload = this.videoUpload, convertOptionList = []) => {
    const videoList = Array.isArray(videoUpload) ?
      videoUpload
        .filter(element => element?.mimetype?.indexOf('video') >= 0)
        .map((element, index) => this.handbrakeOption(element, convertOptionList, index)) :
      [this.handbrakeOption(videoUpload, convertOptionList)];

    videoList.map((video) => {
      // https://liyaoli.com/2017-06-26/unhandled-promise-rejection.html
      // await hbjs
      //   .run({
      //     ...video,
      //     subtitle: 1,
      //     'subtitle-burned': 1
      //   })

      hbjs
        .spawn({
          ...video
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
        .on('complete', async () => {
          if (typeof (this.onComplete) === 'function') {
            await this.onComplete(video);
          }
          if (this.deleteOriginalVideo === true) {
            // https://www.geeksforgeeks.org/node-js-fs-unlinksync-method/
            if (typeof (video['ssa-file']) === 'string') {
              fs.unlinkSync(video['ssa-file']);
            }
            fs.unlinkSync(video.input);
          }
          console.log('complete!');
        })
        .on('error', (err) => {
          if (typeof (this.onError) === 'function') {
            this.onError(err, video);
          }
          console.log({ err });
        });
    });
  }

  handbrakeOption = (video = {}, convertOptionList = [], index = 0) => {
    const videoFilename = video.filename || '_';
    const filename = videoFilename.substring(0, videoFilename.lastIndexOf('.')) + '.mp4';
    const ssaFilePath = (video.path || '').substring(0, (video.path || '').lastIndexOf('/originalVideo')) + '/subtitle/';

    const subtitleOptions = typeof (convertOptionList[index]?.['ssa-file']) === 'string' && convertOptionList[index]?.['ssa-file'] !== '' ? {
      'ssa-file': ssaFilePath + convertOptionList[index]['ssa-file'],
      'ssa-burn': convertOptionList[index]['ssa-burn'],
    } : {
      subtitle: convertOptionList[index]?.subtitle || 1,
      'subtitle-burned': convertOptionList[index]?.['subtitle-burned'] || 1
    }

    return {
      input: video.path,
      output: (video.destination || '').replace('/originalVideo', '') + '/' + filename,
      ...subtitleOptions
    };
  }
}

// export default new videoConverter();