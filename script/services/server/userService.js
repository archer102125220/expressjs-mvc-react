import crypto from 'crypto';
import Models from '@models/server';
const { userList, videoList, sequelize } = Models;
const { Op } = sequelize;

class userService {
  // eslint-disable-next-line no-unused-vars
  allUsers = async (payload = -1) => {
    try {
      return await userList.findAll({
        /*where: {
            [Op.not]:[
                { id:{ [Op.eq]:payload } },
            ]
        },*/
        attributes: {
          // include: [],  //外來鍵欄位
          exclude: ['password']  //不顯示欄位
        }
      });
      // const userData = await userList.findOne({
      //     where: { id: 1 },  // where 條件
      //     attributes: ['id']  //指定回傳欄位
      // });
    } catch (error) {
      console.log(error);
    }
  }
  findUser = async (payload = {}, login = false) => {
    try {
      const exclude = login ? ['password', 'avater'] : ['password'];
      return await userList.findAll({
        where: payload, // where 條件
        attributes: {
          // include: [],  //外來鍵欄位
          exclude,  //不顯示欄位
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  createUser = async (payload = {}) => {
    try {
      const { account, password, email, avater } = payload;
      const img = avater ? (process.env.AVATER_DIR || '/upload/') + avater : '/assets/damage.png';
      return await userList.findOrCreate({
        where: {
          [Op.or]: [
            { account: { [Op.eq]: account } },
            { email: { [Op.eq]: email } }
          ]
        },
        defaults: {
          account,
          email,
          avater: process.env.BUFFER_IMAGE ? avater : img,
          password: crypto.createHash('sha1').update(password).digest('hex')
        }
      }).spread((data, created) => created);
    } catch (error) {
      console.log(error);
    }
  }
  userDetailed = async (payload = {}) => {
    try {
      return await userList.findOne({
        where: payload, // where 條件
        attributes: {
          exclude: ['password'],
        },
        include: {
          model: videoList,
          attributes: {
            exclude: ['video'],
          },
          // through: {
          //   attributes: [],
          // }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new userService();