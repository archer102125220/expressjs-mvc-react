import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

export default class ScreenshotPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { videoList } = this.props;

    return (videoList.map((video, index) =>
      typeof (video) === 'string' && video !== '' ?
        <Fragment key={index}>
          <video id={`video-${index}`} src={video} />
        </Fragment>
        :
        ''
    ));
  }
  static propTypes = {
    videoList: PropTypes.array,
  };
}