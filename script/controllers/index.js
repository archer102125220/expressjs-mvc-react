//import Socket from '../socketIo';
//import userService from '@/services/userService';

class Index {
    homePage = async (req, res, next) => {
        // Socket.io.emit('testEvent', await userService.AllUsers());
        res.render('index', { title: 'Express' });
    }
}

export default new Index();