//import Socket from '@server/socketIo';
//import userService from '@services/server/userService';

class Index {
  homePageData = () => {
    return { title: 'Express MVC-React' };
  }
  homePage = /*async */(req, res) => {
    // Socket.io.emit('testEvent', await userService.AllUsers());
    res.render('Index', this.homePageData());
  }
  homePageAPI = (req, res) => {
    res.status(200).json(this.homePageData());
  }
  login = (req, res) => {
    res.render('Login');
  }
  player = (req, res) => {
    res.render('Video_Player');
  }
}

export default new Index();