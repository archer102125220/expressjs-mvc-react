//import Socket from '@server/socketIo';
//import userService from '@server/services/userService';

class Index {
  homePage = async (req, res) => {
    // Socket.io.emit('testEvent', await userService.AllUsers());
    res.render('index', { title: 'Express' });
  }
}

export default new Index();