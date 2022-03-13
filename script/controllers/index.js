//import Socket from '@server/socketIo';
//import userService from '@services/server/userService';

class Index {
  homePageData = () => {
    return { title: 'Express MVC-React' };
  }
  homePage = /*async */(req, res) => {
    // Socket.io.emit('testEvent', await userService.allUsers());
    res.render('Index', this.homePageData());
  }
  homePageAPI = (req, res) => {
    res.status(200).json(this.homePageData());
  }
  login = (req, res) => {
    res.render('Login');
  }
  homePageRedirect = (req, res) => {
    res.redirect('/');
  }
  logout = (req, res) => {
    res.cookie('token', '', { httpOnly: true });
    res.redirect('/');
  }
}

export default new Index();