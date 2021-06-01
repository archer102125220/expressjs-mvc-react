import React from 'react';
import PropTypes from 'prop-types';

export default class Head extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSever: typeof (window) === 'object'
    };
  }

  render() {
    console.log();
    return <head></head>;
  }
  static propTypes = {
    children: PropTypes.node,
  };
}