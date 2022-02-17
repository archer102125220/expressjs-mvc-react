import Models from '@models/server';
const { videoList, userList, videoJurisdiction, /*sequelize*/ } = Models;

class videoJurisdictionService {

  findJurisdiction = async (payload = {}) => {
    try {
      return await videoJurisdiction.findOne({
        where: payload, // where 條件
        include: [
          {
            model: userList,
            attributes: {
              exclude: ['password', 'email', 'id'],
            },
          },
          {
            model: videoList,
          }
        ]
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new videoJurisdictionService();