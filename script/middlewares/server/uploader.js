import multer from 'multer';
import path from 'path';
import fs from 'fs';

//https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md
//const dest = process.env.UPLOAD_IMG || 'script/public/upload';
const { diskStorage, memoryStorage } = multer;
function filename(req, file, cb) {
  const userName = req.auth ? '-' + req.auth.account : '';
  cb(null, file.fieldname + '-' + path.basename(file.originalname, path.extname(file.originalname)) + userName + '-' + Date.now() + path.extname(file.originalname));
}

class uploader {
  constructor() {
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
          filename
        })
      });
    }
    if (typeof (process.env.UPLOAD_VIDEO) === 'string' && process.env.UPLOAD_VIDEO !== '') {
      this.videoUploader = this.creater(publicPath + '/' + process.env.UPLOAD_VIDEO, true);
    }
  }

  creater = (dir, video = false) => {
    return new multer({
      storage: process.env.BUFFER_IMAGE && video === false ? memoryStorage() : diskStorage({
        destination: function (req, file, cb) {
          const dirName = (dir || this.publicPath + '/upload');
          const subDirName = (dir || this.publicPath + '/upload') + (video === true ? '/originalVideo' : '/');
          if (fs.existsSync(dirName) === false) {
            fs.mkdirSync(dirName);
          }
          if (fs.existsSync(subDirName) === false) {
            fs.mkdirSync(subDirName);
          }
          cb(null, subDirName);
        },
        filename
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
