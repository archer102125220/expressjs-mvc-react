//import Socket from '@server/socketIo';
//import userService from '@services/server/userService';

class Index {
  homePageData = () => {
    return { title: 'Express MVC-React' };
  }
  homePage = async (req, res) => {
    // Socket.io.emit('testEvent', await userService.AllUsers());
    res.render('index', this.homePageData());
  }
  homePageAPI = (req, res) => {
    res.status(200).json(this.homePageData());
  }
  login = (req, res) => {
    res.render('login');
  }
  player = (req, res) => {
    res.render('video_player');
  }
}

export default new Index();