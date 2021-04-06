import crypto from 'crypto';
import * as Models from '@server/models';
const { userList, sequelize } = Models
const { Op } = sequelize;

class userService {
  AllUsers = async (payload = -1) => {
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
  }
  findUser = async (payload = {}, login = false) => {
    const exclude = login ? ['password', 'avater'] : ['password'];
    return await userList.findAll({
      where: payload, // where 條件
      attributes: {
        // include: [],  //外來鍵欄位
        exclude,  //不顯示欄位
      }
    });
  }
  createUser = async (payload = {}) => {
    const { account, password, email, avater } = payload;
    const img = avater ? (process.env.AVATER_DIR || '/upload/') + avater : '/images/damage.png';
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
  }
}

export default new userService();