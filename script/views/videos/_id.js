import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import VideoPlayer from '@utils/components/VideoPlayer';
import Head from '@utils/components/Head';

const mobileVideoStyle = {
  width: '100vw',
};

const videoStyle = {
  // width: '80vw',
  margin: 'auto',
  height: '50%'
};

const styles = {
  title: {
    fontSize: '1.5em',
    padding: '0.625em'
  },
  videoPlayerClassName: {
    ...videoStyle,
    '& > .plyr': {
      width: '100%',
      // height: 'auto',
      height: '100%'
    }
  },
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
    ...videoStyle,
    position: 'relative',
    height: '50vh',
    '& > img': {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      backgroundColor: '#000000'
    }
  },
  itemMobileClassName: mobileVideoStyle,
  owner: {
    padding: '0.625em'
  }
};

const mapStateToProps = (state) => ({
  videoInfo: state.videoList?.videoInfo,
  isMobile: state.system?.isMobile,
  userData: state.userList?.userData,
});

const mapDispatchToProps = (dispatch) => ({
  GET_VideoInfo: (payload, callback, loading) => dispatch({ type: 'videoList/GET_VideoInfo', payload, callback, loading }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(
  class Videos_id extends Component {
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
      const { videoInfo, classes, isMobile, userData } = this.props;
      const videoNameArray = videoInfo?.videoName?.split('.') || [];
      const extname = videoNameArray[videoNameArray.length - 1];
      const fileName = videoInfo?.videoName?.replace(new RegExp(`.${extname}$`), '');
      const videoName = fileName?.split('_-_')[1];
      const download = userData.id === videoInfo.owner || videoInfo.download;
      const controls = [
        'play-large',
        isMobile === false ? 'restart' : '',
        isMobile === false ? 'rewind' : '',
        'play',
        isMobile === false ? 'fast-forward' : '',
        'progress',
        'current-time',
        'duration',
        'mute',
        'volume',
        'captions',
        'settings',
        'pip',
        'airplay',
        download === true ? 'download' : '',
        'fullscreen',
      ];

      return (
        <div>
          <Head><title>{videoName}</title></Head>
          <p className={classes.title}>{videoName}</p>
          {
            videoInfo?.video ?
              <VideoPlayer videoPlayerClassName={isMobile ? classes.videoPlayerMobileClassName : classes.videoPlayerClassName} src={videoInfo.video} controls={controls} />
              :
              <div className={[classes.item, isMobile ? classes.itemMobileClassName : ''].join(' ')}>
                <img src={videoInfo.videoScreenshot} alt={videoName} />
                <ImageListItemBar
                  title={videoName}
                  subtitle={<span>by: {videoInfo?.userList?.account || ''}</span>}
                />
              </div>
          }
          <p className={classes.owner}>擁有者：{videoInfo?.userList?.account || ''}</p>
        </div>
      );
    }

    static propTypes = {
      classes: PropTypes.object,
      videoInfo: PropTypes.object,
      match: PropTypes.object,
      isMobile: PropTypes.bool,
      userData: PropTypes.object
    };

    static defaultProps = {
    }
  }
));
