import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import { BrowserHistory } from '@utils/client/reduxInit';
import Button from '@utils/components/Button';
import Head from '@utils/components/Head';

//https://www.sipios.com/blog-tech/how-to-use-styled-components-with-material-ui-in-a-react-app
const styles = {
  normal: {
    fontFamily: 'Georgia, sans-serif',
    textAlign: 'center',
    backgroundColor: '#f5f5dc',
    height: '100vh',
    paddingTop: '3em'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'normal',
    letterSpacing: '-1px',
  },
  login: {
    padding: '3em',
    backgroundColor: '#ffffff',
    margin: 'auto',
    width: 'calc(50vw - 3em)',
    borderRadius: '10px'
  },
  loginBlock: {
    width: '15vw',
    margin: 'auto',
    paddingRight: '3em',
    paddingLeft: '3em',
    backgroundColor: '#ffffff',
    '& > *': {
      marginTop: '1em',
    },
  },
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  POST_UserLogin: (payload, callback, loading) => dispatch({ type: 'userList/POST_UserLogin', payload, callback, loading }),
  POST_UserRegistered: (payload, callback, loading) => dispatch({ type: 'userList/POST_UserRegistered', payload, callback, loading }),
  goToRoute: (path, callback) => {
    BrowserHistory.push(path);
    if (callback) { callback(); }
  },
  Message_information: (payload, callback) => dispatch({ type: 'system/message_information', payload, callback }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(
  class TestPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        account: '',
        password: '',
        accountError: false,
        passwordError: false,
        login: true,
        rememberMe: false,
        email: '',
        emailError: false,
      };
    }

    componentDidMount = () => {
      const rememberMe = localStorage.getItem('rememberMe');
      this.setState({ rememberMe: rememberMe === 'true' });
      const token = localStorage.getItem('token');
      if (typeof (token) === 'string' && token !== '') {
        // this.props.Message_information('偵測到已登入資訊');
        // this.props.goToRoute('/');
      }

    }

    handleLogin = () => {
      const { account, password, rememberMe, login, email } = this.state;
      let { accountError, passwordError, emailError } = this.state;
      accountError = typeof (account) !== 'string' || account === '';
      passwordError = typeof (password) !== 'string' || password === '';
      emailError = typeof (email) !== 'string' || email === '';
      const errorState = { accountError, passwordError };

      if (accountError === true || passwordError === true) {
        if (emailError === true && login === false) {
          errorState.emailError = emailError;
        }
        this.setState(errorState);
        return;
      }

      if (login === true) {
        this.props.POST_UserLogin({ account, password, rememberMe }, () => this.props.goToRoute('/'));
      } else {
        if (emailError === true) {
          this.setState({
            emailError
          });
          return;
        }
        this.props.POST_UserRegistered({ account, password, email });
      }
    }

    accountChange = (e) => {
      this.setState({
        account: e.target.value,
        accountError: false
      });
    }
    passwordChange = (e) => {
      this.setState({
        password: e.target.value,
        passwordError: false
      });
    }
    emailChange = (e) => {
      this.setState({
        email: e.target.value,
        emailError: false
      });
    }
    rememberMeChange = () => {
      this.setState({
        rememberMe: !this.state.rememberMe
      });
    }

    render() {
      const { classes } = this.props;
      const { account, password, accountError, passwordError, login, rememberMe, email, emailError } = this.state;
      return (
        <div className={classes.normal} >
          <Head>
            <title>test</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>
          <div className={classes.login}>
            <div>
              <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>註冊</Grid>
                <Grid item>
                  <Switch
                    checked={login}
                    onChange={() => this.setState({ login: !login })}
                    color="primary"
                  />
                </Grid>
                <Grid item>登入</Grid>
              </Grid>
            </div>
            <div className={classes.title}>
              {login === true ? '登入' : '註冊'}
            </div>
            <div className={classes.loginBlock}>
              <TextField
                label="帳號"
                autoComplete="username"
                variant="outlined"
                value={account}
                error={accountError}
                onChange={this.accountChange}
              />
              <Collapse in={login === false}>
                <TextField
                  label="信箱"
                  type="email"
                  autoComplete="current-password"
                  variant="outlined"
                  value={email}
                  error={emailError}
                  onChange={this.emailChange}
                />
              </Collapse>
              <TextField
                label="密碼"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                value={password}
                error={passwordError}
                onChange={this.passwordChange}
              />

              <FormControlLabel
                value="end"
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={this.rememberMeChange}
                    color="primary"
                  />}
                label="記住我"
                labelPlacement="end"
              />
              <Button onClick={this.handleLogin}>{login === true ? '登入' : '註冊'}</Button>
              <Button component={Link} to='/' >返回</Button>
            </div>
          </div>
        </div >);
    }

    static propTypes = {
      classes: PropTypes.object,
      goToRoute: PropTypes.func,
      POST_UserLogin: PropTypes.func,
      Message_information: PropTypes.func,
      POST_UserRegistered: PropTypes.func,
    };

    static defaultProps = {
      title: ''
    }
  }
));