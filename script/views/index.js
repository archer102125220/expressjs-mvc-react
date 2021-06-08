import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Logo from '@server/public/assets/logo.svg';
import '@server/public/stylesheets/App.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// https://stackoverflow.com/questions/57012780/adding-css-to-react-ssr-components


const mapStateToProps = (state) => ({
  users: state.userList?.userList || [],
});

const mapDispatchToProps = (dispatch) => ({
  GET_UserList: (payload, callback, loading) => dispatch({ type: 'userList/GET_UserList', payload, callback, loading }),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
        title: 'state'
      };
    }

    static getInitialProps({ serverData, reduxStore, isServer }) {
      if (isServer === true) {
        reduxStore.dispatch({ type: 'userList/TEST_UserList', payload: [1] });
        return { ...serverData };
      }
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
            <Link to="/testPage" className="App-link">SPA換頁測試</Link>
          </header>
        </div>);
    }

    static propTypes = {
      children: PropTypes.node,
      history: PropTypes.any,
      title: PropTypes.string,
    };

    static defaultProps = {
      title: '12345'
    }
  }
);