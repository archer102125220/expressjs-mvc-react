import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { BrowserHistory } from '@utils/client/reduxInit';
import Head from '@utils/components/Head';
import Button from '@utils/components/Button';
import LoginForm from '@views/components/LoginForm';

//https://www.sipios.com/blog-tech/how-to-use-styled-components-with-material-ui-in-a-react-app
const styles = {
  LoginPage: {
    fontFamily: 'Georgia, sans-serif',
    textAlign: 'center',
    backgroundImage: 'linear-gradient(343deg , #69EACB 0%, #EACCF8 48%, #6654F1 100%)',
    paddingTop: '3em',
    minHeight: '78vh'
  },
  LoginPageMobile: {
    paddingTop: '1em',
  }
};

const mapStateToProps = (state) => ({
  isMobile: state.system?.isMobile || false
});


const mapDispatchToProps = (dispatch) => ({
  POST_UserLogin: (payload, callback, loading) => dispatch({ type: 'userList/POST_UserLogin', payload, callback, loading }),
  POST_UserRegistered: (payload, callback, loading) => dispatch({ type: 'userList/POST_UserRegistered', payload, callback, loading }),
  goToRoute: (path, callback) => {
    console.log({ BrowserHistory });
    BrowserHistory.push(path);
    if (callback) { callback(); }
  },
  Message_information: (payload, callback) => dispatch({ type: 'system/message_information', payload, callback }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(
  class LoginPage extends Component {
    constructor(props) {
      super(props);
    }

    componentDidMount = () => {
      const token = localStorage.getItem('token');
      if (typeof (token) === 'string' && token !== '') {
        // this.props.Message_information('偵測到已登入資訊');
        // this.props.goToRoute('/');
      }
    }

    render() {
      const { classes, POST_UserLogin, goToRoute, POST_UserRegistered, isMobile } = this.props;
      return (
        <div className={[classes.LoginPage, isMobile ? classes.LoginPageMobile : ''].join(' ')} >
          <Head>
            <title>登入</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>
          <LoginForm POST_UserLogin={POST_UserLogin} loginCallback={() => goToRoute('/')} POST_UserRegistered={POST_UserRegistered} isMobile={isMobile} >
            <Button component={Link} to='/' >返回</Button>
          </LoginForm>
        </div >);
    }

    static propTypes = {
      classes: PropTypes.object,
      goToRoute: PropTypes.func,
      POST_UserLogin: PropTypes.func,
      Message_information: PropTypes.func,
      POST_UserRegistered: PropTypes.func,
      isMobile: PropTypes.bool,
    };

    static defaultProps = {
      title: ''
    }
  }
));