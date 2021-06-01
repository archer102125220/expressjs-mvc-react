import Express from 'express';
//import Socket from '@server/socketIo';
//import userService from '@services/server/userService';

class Index extends Express.Router {
  constructor(props) {
    super(props);
    this.get('/', this.homePage);
  }

  homePage = async (req, res) => {
    // Socket.io.emit('testEvent', await userService.AllUsers());
    res.render('index', { title: 'Express MVC-React' });
  }
}

export default new Index();