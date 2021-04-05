import crypto from 'crypto';
// import fs from 'fs';
import UserService from '@/services/userService';
import JWTMiddleware from '@/middlewares/JWT';

class Users {
    usersList = async (req, res, next) => {
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

    findUser = async (req, res, next) => {
        const { name:account } = req.params; //→接受URL上的資料(ex:/api/users/account/:name)
        const userData = await UserService.findUser({ account });
        if ((userData || []).length === 0) {
            res.status(200).json('查無資料');
        }
        res.status(200).json(userData);
    }
    
    loginUser = async (req, res, next) => {
        const { account, password } = req.query;
        const userData = await UserService.findUser({
            account,
            password:crypto.createHash('sha1').update(password).digest('hex')
        }, true);

        if ((userData || []).length === 0) {
            res.status(200).send('查無資料');
        }else{
            res.status(200).send(JWTMiddleware.encode(userData[0].dataValues));
        }
    }

    createUser = async (req, res, next) => {
        const { body:payload } = req;
        const clear = await UserService.createUser({...payload, avater:(req.file || {}).filename});

        if(clear){
            res.status(200).send('註冊成功！');
        }else{
            res.status(200).send('帳號或信箱已存在！');
        }
    }

    imgUploadTest = async (req, res, next) => {
        const { body:payload } = req; 
        console.log(req.file);

        res.status(200).json({
            ...payload, avater:req.avater, file:req.file, video:req.video
        });
    }

    // usersListSocket = async (packet, next) => {
    //     const userData = await userList.findAll();
    //     if (packet.doge === true) return next();
    //     next(new Error('Not a doge error'));
    //     return await UserService.AllUsers();
    // }
}

export default new Users();