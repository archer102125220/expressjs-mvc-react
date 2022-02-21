import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import VideoPlayer from '@utils/components/VideoPlayer';

const mobileVideoStyle = {
  width: '100vw',
};

const styles = {
  videoPlayerMobileClassName: {
    '& > .plyr': mobileVideoStyle
  },
  videoScreenshot: {
    width: '30em',
    // margin: 'auto',
    paddingLeft: '0.5em',
    paddingRight: '0.5em',
    paddingBottom: '0.5em'
  },
  item: {
    position: 'relative',
    width: '50vw',
    height: '50vh',
    '& > img': {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      backgroundColor: '#000000'
    }
  },
  itemMobileClassName: mobileVideoStyle
};

const mapStateToProps = (state) => ({
  videoInfo: state.videoList?.videoInfo,
  isMobile: state.system?.isMobile,
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
      const { videoInfo, classes, isMobile } = this.props;
      const videoNameArray = videoInfo?.videoName?.split('.') || [];
      const extname = videoNameArray[videoNameArray.length - 1];
      const fileName = videoInfo?.videoName?.replace(new RegExp(`.${extname}$`), '');
      const videoName = fileName?.split('_-_')[1];
      return (
        videoInfo?.video ?
          <VideoPlayer videoPlayerClassName={isMobile ? classes.videoPlayerMobileClassName : null} src={videoInfo.video} controls={['download']} />
          :
          <div className={[classes.item, isMobile ? classes.itemMobileClassName : ''].join(' ')}>
            <img src={videoInfo.videoScreenshot} alt={videoName} />
            <ImageListItemBar
              title={videoName}
              subtitle={<span>by: {videoInfo?.userList?.account || ''}</span>}
            />
          </div>

      );
    }

    static propTypes = {
      classes: PropTypes.object,
      videoInfo: PropTypes.object,
      GET_VideoInfo: PropTypes.func,
      match: PropTypes.object,
      isMobile: PropTypes.bool
    };

    static defaultProps = {
    }
  }
));
