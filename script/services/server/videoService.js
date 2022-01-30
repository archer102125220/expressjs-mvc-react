import Models from '@models/server';
const { videoList, userList, videoJurisdiction, sequelize } = Models;

class videoService {

  allVideos = async () => {
    const video = await videoList.findAll({
      include: {
        model: userList,
        attributes: {
          exclude: ['password', 'email', 'id'],
        },
        // through: {
        //   attributes: [],
        // }
      },
    });
    return video;
  }
  findVideoList = async (payload = {}) => {
    const video = await videoList.findAll({
      where: payload, // where 條件
      include: [
        {
          model: userList,
          attributes: {
            exclude: ['password', 'email', 'id'],
          },
          // through: {
          //   attributes: [],
          // }
        },
        videoJurisdiction
      ]
    });
    return video;
  }
  findVideo = async (payload = {}) => {
    const video = await videoList.find({
      where: payload, // where 條件
      include: [
        {
          model: userList,
          attributes: {
            exclude: ['password', 'email', 'id'],
          },
          // through: {
          //   attributes: [],
          // }
        },
        videoJurisdiction
      ]
    });
    return video;
  }
  uploadVideo = async (videoName = '', user_Id = '') => {
    if (typeof (process.env.UPLOAD_VIDEO) !== 'string' || process.env.UPLOAD_VIDEO === '') throw 'ERROR:can not fint UPLOAD_VIDEO';

    return await videoList.create({
      owner: user_Id,
      videoName,
      video: '/' + process.env.UPLOAD_VIDEO + '/' + videoName
    });
  }
}

export default new videoService();