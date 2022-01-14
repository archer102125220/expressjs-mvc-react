import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import PropTypes from 'prop-types';
import Button from '@utils/components/Button';

//https://www.sipios.com/blog-tech/how-to-use-styled-components-with-material-ui-in-a-react-app
const styles = {
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

function LoginForm({ classes, children, POST_UserLogin, POST_UserRegistered, loginCallback }) {
  const [account, setAccount] = useState('');
  const [accountError, setAccountError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [login, setLogin] = useState(true);
  useEffect(() => {
    const rememberMe = localStorage.getItem('rememberMe');
    setRememberMe(rememberMe === 'true');
  }, []);

  const handleLogin = () => {
    const newAccountError = typeof (account) !== 'string' || account === '';
    const newPasswordError = typeof (password) !== 'string' || password === '';
    const newEmailError = typeof (email) !== 'string' || email === '';

    if (newAccountError === true || newPasswordError === true) {
      if (newEmailError === true && login === false) {
        setEmailError(newEmailError);
      }
      setAccountError(newAccountError);
      setPasswordError(newPasswordError);
      return;
    }

    if (login === true) {
      POST_UserLogin({ account, password, rememberMe }, loginCallback);
    } else {
      if (newEmailError === true) {
        setEmailError(newEmailError);
        return;
      }
      POST_UserRegistered({ account, password, email });
    }
  };

  return (
    <div className={classes.login}>
      <div>
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>註冊</Grid>
          <Grid item>
            <Switch
              checked={login}
              onChange={() => setLogin(!login)}
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
          onChange={(e) => { setAccount(e.target.value); setAccountError(false); }}
        />
        <Collapse in={login === false}>
          <TextField
            label="信箱"
            type="email"
            autoComplete="current-password"
            variant="outlined"
            value={email}
            error={emailError}
            onChange={(e) => { setEmail(e.target.value); setEmailError(false); }}
          />
        </Collapse>
        <TextField
          label="密碼"
          type="password"
          autoComplete="current-password"
          variant="outlined"
          value={password}
          error={passwordError}
          onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
        />

        <FormControlLabel
          value="end"
          control={
            <Checkbox
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              color="primary"
            />}
          label="記住我"
          labelPlacement="end"
        />
        <Button onClick={handleLogin}>{login === true ? '登入' : '註冊'}</Button>
        {children}
      </div>
    </div>
  );
}

LoginForm.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object,
  POST_UserLogin: PropTypes.func,
  POST_UserRegistered: PropTypes.func,
  loginCallback: PropTypes.func
};

LoginForm.defaultProps = {
  classes: {},
  POST_UserLogin: () => { },
  POST_UserRegistered: () => { },
  loginCallback: () => { }
};

export default withStyles(styles)(LoginForm);