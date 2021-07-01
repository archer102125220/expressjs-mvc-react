import crypto from 'crypto';
import fs from 'fs';
import hbjs from 'handbrake-js';
import UserService from '@services/server/userService';
import JWTMiddleware from '@server/middlewares/JWT';

class Users {
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
    const clear = await UserService.createUser({ ...payload, avater: (req.file || {}).filename });

    if (clear) {
      res.status(200).send('註冊成功！');
    } else {
      res.status(200).send('帳號或信箱已存在！');
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
    try {
      const { body: payload } = req;

      const videoUploadList = req.file || req.files;
      // console.log(req.file);
      // console.log(req.files);

      this.videoProcessing(videoUploadList);


      res.status(200).json({
        ...payload, videoUploadList
      });
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  }

  videoProcessing = (videoUploadList) => {
    try {

      const videoList = Array.isArray(videoUploadList) ? videoUploadList.map(this.handbrakeOption) : [this.handbrakeOption(videoUploadList)];
      // https://liyaoli.com/2017-06-26/unhandled-promise-rejection.html
      videoList.map((video) =>
        hbjs
          .spawn({
            ...video,
            subtitle: 1,
            'subtitle-burned': 1
          })
          .on('start', () => {
            console.log('video process start');
            // console.log({ start });
          })
          // .on('progress', progress => {
          //   console.log(
          //     'Percent complete: %s, ETA: %s',
          //     progress.percentComplete,
          //     progress.eta
          //   );
          // })
          .on('complete', () => {
            // https://www.geeksforgeeks.org/node-js-fs-unlinksync-method/
            fs.unlinkSync(video.input);
            console.log('complete!');
          })
          .on('error', (err) => {
            console.log({ err });
          })
      );
    } catch (error) {
      console.log(error);
    }
  }

  handbrakeOption = (video = {}) => {
    const videoFilename = video.filename || '';
    const filename = videoFilename.substring(0, videoFilename.lastIndexOf('.')) + '.mp4';

    return {
      input: video.path,
      output: (video.destination || '').replace('/originalVideo', '') + '/' + filename
    };
  }

  // usersListSocket = async (packet, next) => {
  //     const userData = await userList.findAll();
  //     if (packet.doge === true) return next();
  //     next(new Error('Not a doge error'));
  //     return await UserService.AllUsers();
  // }
}

export default new Users();