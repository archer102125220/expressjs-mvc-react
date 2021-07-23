import multer from 'multer';
import path from 'path';
import fs from 'fs';

//https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md
//const dest = process.env.UPLOAD_IMG || 'script/public/upload';
const { diskStorage, memoryStorage } = multer;

class uploader {
  constructor() {
    this.record = [];
    const rootPath = process.cwd();
    const publicPath = rootPath + ((process.env.NODE_ENV !== 'production') ? '/script' : '/dist') + '/public';
    this.publicPath = publicPath;
    this.imgUploader = this.creater(publicPath + '/' + process.env.UPLOAD_IMG);
    if (!process.env.BUFFER_IMAGE) {
      this.avaterUploader = new multer({
        storage: diskStorage({
          destination: function (req, file, cb) {
            const dirName = (publicPath + '/' + process.env.AVATER_DIR) || (publicPath + '/assets/upload');
            if (fs.existsSync(dirName) === false) {
              fs.mkdirSync(dirName);
            }
            cb(null, dirName);
          },
          filename: this.filename
        })
      });
    }
    if (typeof (process.env.UPLOAD_VIDEO) === 'string' && process.env.UPLOAD_VIDEO !== '') {
      this.videoUploader = this.creater(publicPath + '/' + process.env.UPLOAD_VIDEO, true);
    }
  }

  filename = (req, file, cb) => {
    const userName = req.auth ? '-' + req.auth.account : '';
    cb(null, file.fieldname + '-' + path.basename(file.originalname, path.extname(file.originalname)) + userName + '-' + Date.now() + path.extname(file.originalname));
  }

  videoFilename = (req, file, cb) => {
    const { body, query } = req;
    const { videoOptionList: videoOptionListJSON } = body || query || {};
    const videoOptionList = JSON.parse(videoOptionListJSON);
    if (Array.isArray(req.record) !== true) {
      req.record = [];
    }
    const index = req.record.length;
    if (file.mimetype.indexOf('video') < 0) {
      return cb(null, file.originalname);
    }
    if (videoOptionList.find(videoOption => req.record.indexOf(videoOption.timestamp)) !== undefined && typeof (videoOptionList[index].timestamp) === 'number') {
      req.record.push(videoOptionList[index].timestamp);
    }
    const newName = videoOptionList[index].newName || path.basename(file.originalname, path.extname(file.originalname));
    const userName = req.auth ? '-' + req.auth.account : '';
    cb(null, file.fieldname + '-' + newName + userName + '-' + videoOptionList[index].timestamp + path.extname(file.originalname));
  }

  creater = (dir, videoMode = false) => {
    return new multer({
      storage: process.env.BUFFER_IMAGE && videoMode === false ? memoryStorage() : diskStorage({
        destination: function (req, file, cb) {
          const isVideo = file.mimetype.indexOf('video') >= 0;
          const dirName = (dir || this.publicPath + '/upload');
          const subDirName = (dir || this.publicPath + '/upload') + (videoMode === true ? (isVideo === true ? '/originalVideo' : '/subtitle') : '/');
          if (fs.existsSync(dirName) === false) {
            fs.mkdirSync(dirName);
          }
          if (fs.existsSync(subDirName) === false) {
            fs.mkdirSync(subDirName);
          }
          cb(null, subDirName);
        },
        filename: videoMode === true ? this.videoFilename : this.filename
      })
    });
  }

  arrayImg = () => {
    return this.imgUploader.array('images', 10000);
  }

  singleImg = () => {
    return this.imgUploader.single('image');
  }

  avater = () => {
    return !process.env.BUFFER_IMAGE ? this.avaterUploader.single('avater') : this.imgUploader.single('avater');
  }

  singleVideo = () => {
    return this.videoUploader.single('video');
  }

  arrayVideo = () => {
    return this.videoUploader.array('video', 10000);
  }
}

export default new uploader();
