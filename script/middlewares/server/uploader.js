import multer from 'multer';
import path from 'path';

//https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md
//const dest = process.env.UPLOAD_IMG || 'script/public/upload';
const { diskStorage, memoryStorage } = multer;
function filename(req, file, cb) {
  cb(null, file.fieldname + '-' + path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname));
}

class uploader {
  constructor() {
    this.imgUploader = this.creater(process.env.UPLOAD_IMG);
    if (!process.env.BUFFER_IMAGE) {
      this.avaterUploader = new multer({
        storage: diskStorage({
          destination: function (req, file, cb) {
            cb(null, __dirname + '/../public' + process.env.AVATER_DIR || 'script/public/assets/upload');
          },
          filename
        })
      });
    }
    this.videoUploader = this.creater(process.env.UPLOAD_VIDEO);
  }

  creater = (dir) => {
    return new multer({
      storage: process.env.BUFFER_IMAGE ? memoryStorage() : diskStorage({
        destination: function (req, file, cb) {
          cb(null, dir || 'script/public/upload');
        },
        filename
      })
    });
  }

  arrayImg = () => {
    return this.imgUploader.array('images', 10);
  }

  img = () => {
    return this.imgUploader.single('image');
  }

  avater = () => {
    return !process.env.BUFFER_IMAGE ? this.avaterUploader.single('avater') : this.imgUploader.single('avater');
  }

  video = () => {
    return this.videoUploader.single('video');
  }

  arrayVideo = () => {
    return this.videoUploader.array('video', 10);
  }
}

export default new uploader();
