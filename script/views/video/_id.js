import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import VideoPlayer from '@utils/components/VideoPlayer';


const styles = {

};

const mapStateToProps = (state) => ({
  videoInfo: state.videoList?.videoInfo,
});

const mapDispatchToProps = (dispatch) => ({
  GET_VideoInfo: (payload, callback, loading) => dispatch({ type: 'videoList/GET_VideoInfo', payload, callback, loading }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(
  class Player extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    static getInitialProps({ serverData, isServer, reduxStore, match }) {
      if (isServer === true) {
        reduxStore.dispatch({ type: 'videoList/SAVE_video_info', payload: serverData.videoInfo });
      } else {
        try {
          reduxStore.dispatch({ type: 'videoList/GET_VideoInfo', payload: match.pageParams.id });
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') console.log(error);
        }
      }
    }

    render() {
      const { videoInfo } = this.props;
      return (
        <div>
          {videoInfo?.video && <VideoPlayer src={videoInfo.video} controls={['download']} />}
        </div>
      );
    }

    static propTypes = {
      classes: PropTypes.object,
      videoInfo: PropTypes.object,
      GET_VideoInfo: PropTypes.func,
      match: PropTypes.object,
    };

    static defaultProps = {
    }
  }
));
