import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Plyr from 'plyr-react';
// import { Player as VideoReact, BigPlayButton } from 'video-react';
// import videojs from 'video.js';

const styles = {
  VideoPlayer: {
    '& > .plyr': {
      width: '50vw',
      height: '50vh',
    },
    '& > .video-js': {
      width: '50vw',
      height: '50vh',
    },
    '& > .video-js > .vjs-tech': {
      width: '50vw',
      height: '50vh',
    }
  }
};

export default withStyles(styles)(
  class PlyrReact extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
      // this.videoNode = React.createRef();
    }

    // componentDidMount = () => {
    //   const { props } = this;
    //   const { src } = props;
    //   const srcSplit = src.split('.');
    //   const videoType = src.includes('.mkv') ? 'webm ' : srcSplit[srcSplit.length - 1];
    //   // instantiate Video.js
    //   this.player = videojs(this.videoNode.current, {
    //     controls: true,
    //     sources: [
    //       {
    //         src,
    //         type: 'video/' + videoType
    //       }
    //     ],
    //     ...props
    //   }, this.onPlayerReady);

    //   this.player.on('error', this.onPlayerError);
    // }

    // onPlayerError = () => {
    //   console.log(this.player);
    //   console.log(this.player.error());
    // }
    // onPlayerReady = () => {
    //   // console.log('onPlayerReady', this.player);
    //   // console.log(this.play);
    //   // this.player.play();
    // }

    // // destroy player on unmount
    // componentWillUnmount = () => {
    //   if (this.player) {
    //     this.player.dispose();
    //   }
    // }


    render() {
      const { props } = this;
      const {
        classes,
        src,
        videoPlayerClassName
      } = props;
      return (
        <div className={videoPlayerClassName || classes.VideoPlayer} >
          <Plyr
            source={{
              type: 'video',
              sources: [
                {
                  src
                }
              ]
            }}
            options={
              {
                debug: process.env.NODE_ENV !== 'production' && this.props.debug === 'true'
              }
            }
            {...props}
          />
          {/* <VideoReact
            playsInline
            poster={this.props.poster}
            src={src}
            fluid={false}
            width='50%'
            height='50%'
            {...props}
          >
            <BigPlayButton position="center" />
          </VideoReact> */}
          {/* <div data-vjs-player>
            <video ref={this.videoNode} className="video-js" />
          </div> */}
        </div>
      );
    }

    static propTypes = {
      classes: PropTypes.object,
      debug: PropTypes.string,
      videoPlayerClassName: PropTypes.string,
      hlsConfig: PropTypes.object,
      src: PropTypes.string.isRequired,
      poster: PropTypes.string,
    };

    static defaultProps = {
      debug: 'false',
      poster: '',
    }
  }
);
