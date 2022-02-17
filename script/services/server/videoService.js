import Models from '@models/server';
import videoJurisdictionService from '@services/server/videoJurisdictionService';
const { videoList, userList, /*sequelize*/ } = Models;

class videoService {

  allVideos = async () => {
    try {
      const video = await videoList.findAll({
        attributes: {
          exclude: ['video'],
        },
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
    } catch (error) {
      console.log(error);
    }
  }
  findVideoList = async (payload = {}) => {
    try {
      const video = await videoList.findAll({
        where: payload, // where 條件
        attributes: {
          exclude: ['video'],
        },
        include: {
          model: userList,
          attributes: {
            exclude: ['password', 'email', 'id'],
          },
          // through: {
          //   attributes: [],
          // }
        }
      });
      return video;
    } catch (error) {
      console.log(error);
    }
  }
  findVideo = async (payload = {}, userId = 0) => {
    try {
      const video = await videoList.findOne({
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
          }
        ]
      });
      const jurisdiction = await videoJurisdictionService.findJurisdiction({ userListId: userId, videoListId: video.id });
      if (video.owner === userId || jurisdiction?.watch === true) {
        return { ...(JSON.parse(JSON.stringify(video))), jurisdiction: JSON.parse(JSON.stringify(jurisdiction)) };
      }
      return null;
    } catch (error) {
      console.log(error);
    }
  }
  uploadVideo = async (videoName = '', user_Id = '') => {
    try {
      if (typeof (process.env.UPLOAD_VIDEO) !== 'string' || process.env.UPLOAD_VIDEO === '') throw 'ERROR:can not fint UPLOAD_VIDEO';

      return await videoList.create({
        owner: user_Id,
        videoName,
        video: '/' + process.env.UPLOAD_VIDEO + '/' + videoName
      });
    } catch (error) {
      console.log(error);
    }
  }
  saveScreenshot = async (videoName, videoScreenshot) => {
    try {
      const video = await videoList.findOne({
        where: { videoName }, // where 條件
        include: [
          {
            model: userList,
            attributes: {
              exclude: ['password', 'email', 'id'],
            },
            // through: {
            //   attributes: [],
            // }
          }
        ]
      });
      return await video.update({ videoScreenshot });
    } catch (error) {
      console.log({ error });
    }
  }
}

export default new videoService();