import crypto from 'crypto';
import UserService from '@services/server/userService';
import JWTMiddleware from '@server/middlewares/JWT';
import videoConverter from '@utils/server/video-converter';

class Users {
  constructor() {
    this.VideoConverter = new videoConverter({ deleteOriginalVideo: true });
  }
  usersList = async (req, res) => {
    //const { id, start, end } = req.body; //→接受前端來的資料
    const userData = await UserService.AllUsers(req.auth.id);
    if ((userData || []).length === 0) {
      res.status(200).json('查無資料');
    }
    //res.status(200).json([{ ...req.auth }, ...userData]);
    /*res.status(200).json(userData.map(element=>{
        return {...element, avater : fs.readFileSync(__dirname+'/../public'+element.avater)};
    }));*/
    res.status(200).json(userData);
  }

  findUser = async (req, res) => {
    const { name: account } = req.params; //→接受URL上的資料(ex:/api/users/account/:name)
    const userData = await UserService.findUser({ account });
    if ((userData || []).length === 0) {
      res.status(200).json('查無資料');
    }
    res.status(200).json(userData);
  }

  loginUser = async (req, res) => {
    // const { account, password } = req.query;
    const { account, password } = req.body;
    const userData = await UserService.findUser({
      account,
      password: crypto.createHash('sha1').update(password).digest('hex')
    }, true);

    if ((userData || []).length === 0) {
      res.status(200).send('查無資料');
    } else {
      const token = JWTMiddleware.encode(userData[0].dataValues);
      res.cookie('token', token, { httpOnly: true });
      res.status(200).send(token);
    }
  }

  createUser = async (req, res) => {
    const { body: payload } = req;
    try {
      const clear = await UserService.createUser({ ...payload, avater: (req.file || {}).filename });

      if (clear) {
        res.status(200).send('註冊成功！');
      } else {
        res.status(200).send('帳號或信箱已存在！');
      }
    } catch (error) {
      res.status(500).send('請輸入正確資料！');
    }
  }

  imgUploadTest = (req, res) => {
    const { body: payload } = req;
    console.log(req.file);

    res.status(200).json({
      ...payload, avater: req.avater, file: req.file, video: req.video
    });
  }
  videoUpload = (req, res) => {
    const { body: payload } = req;
    const { videoOptionList: videoOptionListJSON } = payload;
    const videoOptionList = JSON.parse(videoOptionListJSON);
    const videoUploadList = req.file || req.files;
    // console.log(req.record);

    this.VideoConverter.convert(videoUploadList, videoOptionList);

    // res.status(200).json({
    //   ...payload, videoUploadList, videoOptionList
    // });
    res.status(200).send('檔案上傳成功！開始轉檔...');
  }

  // usersListSocket = async (packet, next) => {
  //     const userData = await userList.findAll();
  //     if (packet.doge === true) return next();
  //     next(new Error('Not a doge error'));
  //     return await UserService.AllUsers();
  // }
}

export default new Users();