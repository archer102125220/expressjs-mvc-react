import React, { Component } from 'react';

export default class ErrorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ''
    }
  }

  render() {
    const { message, error } = this.props;
    console.log({ message, error })
    return <div>
      <h1>{message}</h1>
      <h2>{error?.status}</h2>
      <pre>{error?.stack}</pre>
    </div>
  }
}