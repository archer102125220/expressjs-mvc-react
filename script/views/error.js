import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ErrorPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { message, error } = this.props;
    console.log({ message, error });
    return (<div>
      <h1>{message}</h1>
      <h2>{error?.status}</h2>
      <pre>{error?.stack}</pre>
    </div>);
  }
  static propTypes = {
    children: PropTypes.any,
    history: PropTypes.any,
    message: PropTypes.string,
    error: PropTypes.object,
  };
}