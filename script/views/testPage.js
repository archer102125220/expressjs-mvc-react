import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Logo from '@server/public/assets/logo.svg';
import '@server/public/stylesheets/App.css';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Button from '@utils/components/Button';
import { BrowserHistory } from '@utils/client/reduxInit';
import { GET_userList } from '@services/client/userList';
// https://stackoverflow.com/questions/57012780/adding-css-to-react-ssr-components


//https://www.sipios.com/blog-tech/how-to-use-styled-components-with-material-ui-in-a-react-app
const styles = {
  normal: {
    fontFamily: 'Georgia, sans-serif',
    marginTop: '3em',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'normal',
    letterSpacing: '-1px',
  },
  list: {
    fontSize: '1.2em',
    marginTop: '1.8em',
    listStyle: 'none',
    lineHeight: '1.5em',
    '& code': {
      background: '#f7f7f7',
    }
  },
};

const mapStateToProps = (state) => ({
  users: state.userList?.userList || [],
});

const mapDispatchToProps = (dispatch) => ({
  GET_UserList: (payload, callback, loading) => dispatch({ type: 'userList/GET_UserList', payload, callback, loading }),
  goToRoute: (path, callback) => {
    BrowserHistory.push(path);
    if (callback) { callback(); }
  }
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(
  class TestPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        title: 'state'
      };
    }


    static async getInitialProps({ isServer }) {
      if (isServer === true) return { title: 'testPage' };
      const userList = await GET_userList(null, 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiYWNjb3VudCI6Ik1hcm5pZSIsImVtYWlsIjoiTWFybmllQGIuY29tIiwiYWNjb3VudF9JZCI6IjEwZGU5MzY0LWVhM2ItNDQwNC04M2RkLTE0MDJmYTgxNzNiMyIsImNyZWF0ZWRBdCI6IjIwMjEtMDUtMjlUMDc6MDA6MjcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjEtMDUtMjlUMDc6MDA6MjcuMDAwWiIsImlhdCI6MTYyMjk5MTY5NiwiZXhwIjoxNjIzMjUwODk2fQ.5IdJBaXGcvZ-hqBU9-V0sQNDxnUwRqhqMpL6pJZE8fk');
      console.log({ userList });
      return { title: userList[1].account || '', userList };
    }

    render() {
      return (
        <div className="App">
          <header className="App-header">
            <Logo className="App-logo" alt="logo" />
            <h1>{this.props.title}</h1>
            <p>Welcome to {this.props.title}</p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
            <Button onClick={() => { this.props.goToRoute('/'); }}>測試</Button>
          </header>
        </div>);
    }

    static propTypes = {
      children: PropTypes.node,
      history: PropTypes.object,
      title: PropTypes.string,
      users: PropTypes.array,
      goToRoute: PropTypes.func,
    };

    static defaultProps = {
      title: ''
    }
  }
));