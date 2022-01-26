import Models from '@models/server';
const { videoList, userList, sequelize } = Models;

class videoService {

  allVideos = async () => {
    const video = await videoList.findAll({
      include: [
        {
          model: userList,
          attributes: {
            exclude: ['password'],
          }
        }
      ]
    });
    return video;
  }
  findVideo = async (payload = {}) => {
    const video = await videoList.findAll({
      where: payload, // where 條件
      include: [
        {
          model: userList,
          attributes: {
            exclude: ['password'],
          }
        }
      ]
    });
    return video;
  }
  uploadVideo = async (videoName = '', account_Id = '') => {
    if (typeof (process.env.UPLOAD_VIDEO) !== 'string' || process.env.UPLOAD_VIDEO === '') throw 'ERROR:can not fint UPLOAD_VIDEO';

    return await videoList.create({
      owner: account_Id,
      videoName,
      video: '/' + process.env.UPLOAD_VIDEO + '/' + videoName
    });
  }
}

export default new videoService();