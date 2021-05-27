import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'state'
    };
  }

  static getServerData({ serverData, serverReduxStore, isServer }) {
    const defaultProps = this.defaultProps || {};
    if (isServer) serverReduxStore.dispatch({ type: 'userList/TEST_UserList', payload: [1] });
    return { ...defaultProps, ...serverData };
  }

  render() {
    return (<div>
      <h1>{this.props.title}</h1>
      <p>Welcome to {this.props.title}</p>
    </div>);
  }

  static propTypes = {
    children: PropTypes.any,
    history: PropTypes.any,
    title: PropTypes.string,
  };

  static defaultProps = {
    title: '12345'
  }
}