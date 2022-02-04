import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { enquireScreen } from 'enquire-js';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import themCofing from '@theme';
import Message from '@views/components/Message';
// import Socket from '@socket/socketIoClient';
import GlobalLayout from '@views/layouts/GlobalLayout';

const theme = createTheme(themCofing);


const mapStateToProps = (state) => ({
  message: state.system?.message || {},
  isMobile: state.system?.isMobile || false,
});

const mapDispatchToProps = (dispatch) => ({
  SOCKET_UserList: (payload, callback, loading) => {
    dispatch({ type: 'userList/SOCKET_UserList', payload, callback, loading });
  },
  Message_reset: (callback) => dispatch({ type: 'system/message_reset', callback }),
  enquireScreen: (payload, callback) => dispatch({ type: 'system/enquireScreen', payload, callback }),
  SAVE_userToken: (payload, callback) => dispatch({ type: 'userList/SAVE_user_token', payload, callback }),
  GET_UserData: (payload, callback) => dispatch({ type: 'userList/GET_UserData', payload, callback }),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  class LayoutSwitch extends Component {

    componentDidMount = async () => {
      // const { SOCKET_UserList } = this.props;

      // const socketEvents = [
      //   { name: 'testEvent', event: SOCKET_UserList },
      //   { name: 'clickEvent', event: (clickEvent) => console.log({ clickEvent }) }
      // ];
      // Socket.eventInit(socketEvents);
      const { history } = this.props;
      const { pathname } = history.location;
      if (/\/video\/screenshot\??.?/.test(pathname) === 'false') {
        await this.props.GET_UserData();
      }

      const rememberMe = localStorage.getItem('rememberMe');
      const token = localStorage.getItem('token');
      if (rememberMe === 'true' && typeof (token) === 'string' && token !== '') {
        this.props.SAVE_userToken(token);
      }

      if (typeof (window) === 'object') {
        this.windowWidthListener();
        window.addEventListener('resize', this.windowWidthListener);
      }

      const _SSR_CSS__ = document.querySelector('#__EXPRESS_MVC_REACT_SSR_CSS__');
      if (_SSR_CSS__) {
        _SSR_CSS__.parentElement.removeChild(_SSR_CSS__);
      }
    }

    windowWidthListener = () => {
      this.enquireHandler = enquireScreen(mobile => {
        this.props.enquireScreen(mobile ? true : false);
      }/*, '(max-width: 1024px)' */);
    }

    componentWillUnmount = () => {
      if (typeof (window) === 'object') {
        window.removeEventListener('resize', this.windowWidthListener);
      }
    }

    render() {
      const { props } = this;
      const { children, Message_reset, message, history } = props;
      const { location } = history;
      const { pathname } = location;
      return (
        <ThemeProvider theme={theme}>
          {
            /\/video\/screenshot\??.?/.test(pathname) ?
              (<Switch {...props}>{children}</Switch>)
              :
              (<GlobalLayout {...props}>
                <Switch {...props}>{children}</Switch>
              </GlobalLayout>)
          }
          <Message messageText={message.text} messageType={message.type} onClose={Message_reset} />
        </ThemeProvider>
      );
    }
    static propTypes = {
      children: PropTypes.node,
      history: PropTypes.object,
      enquireScreen: PropTypes.func,
      SAVE_userToken: PropTypes.func,
      isMobile: PropTypes.bool,
      message: PropTypes.object,
      Message_reset: PropTypes.func,
      GET_UserData: PropTypes.func,
      // SOCKET_UserList: PropTypes.func,
    };
  }
);
