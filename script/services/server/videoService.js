import Models from '@models/server';
const { videoList, userList, sequelize } = Models;

class videoService {
  constructor() {
    const rootPath = process.cwd();
    const publicPath = rootPath + ((process.env.NODE_ENV !== 'production') ? '/script' : '/dist') + '/public';
    this.publicPath = publicPath;
  }

  allVideo = async () => {
    return await videoList.findAll({
      attributes: {
        include: {
          model: userList,
          required: true
        }
      }
    });
  }
  findVideo = async (payload = {}) => {
    return await videoList.findAll({
      where: payload, // where 條件
      attributes: {
        include: {
          model: userList,
          required: true
        }
      }
    });
  }
  uploadVideo = async (videoName = '', account_Id = '') => {
    if (typeof (process.env.UPLOAD_VIDEO) !== 'string' || process.env.UPLOAD_VIDEO === '') throw 'ERROR:can not fint UPLOAD_VIDEO';

    return await videoList.create({
      owner: account_Id,
      videoName,
      video: this.publicPath + '/' + process.env.UPLOAD_VIDEO + '/' + videoName
    });
  }
}

export default new videoService();