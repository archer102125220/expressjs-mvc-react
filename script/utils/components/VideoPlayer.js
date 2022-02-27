import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import Plyr from 'plyr-react';
// import { Player as VideoReact, BigPlayButton } from 'video-react';
import Plyr from 'plyr';

const styles = {
  VideoPlayer: {
    '& > .plyr': {
      width: '50vw',
      height: '50vh',
    },
    // '& > .video-js': {
    //   width: '50vw',
    //   height: '50vh',
    // },
    // '& > .video-js > .vjs-tech': {
    //   width: '50vw',
    //   height: '50vh',
    // }
  }
};

export default withStyles(styles)(
  class PlyrReact extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
      this.videoNode = createRef();
      this.playerStates = {
        currentTime: 0,
        playing: false,
        volume: 1,
        muted: false,
        speed: 1,
        loop: false
      };
    }

    componentDidMount = () => {
      const { props } = this;
      const {
        debug,
        controls: propControls
      } = props;
      this.instantiatePlyrJs({ debug, propControls, props });
    }

    instantiatePlyrJs = ({ debug, propControls, props }) => {
      const controls = propControls || [
        'play-large', // The large play button in the center
        'restart', // Restart playback
        'rewind', // Rewind by the seek time (default 10 seconds)
        'play', // Play/pause playback
        'fast-forward', // Fast forward by the seek time (default 10 seconds)
        'progress', // The progress bar and scrubber for playback and buffering
        'current-time', // The current time of playback
        'duration', // The full duration of the media
        'mute', // Toggle mute
        'volume', // Volume control
        'captions', // Toggle captions
        'settings', // Settings menu
        'pip', // Picture-in-picture (currently Safari only)
        'airplay', // Airplay (currently Safari only)
        // 'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
        'fullscreen', // Toggle fullscreen
      ];
      // instantiate Plyr.js
      this.player = new Plyr(this.videoNode.current, {
        ...props,
        debug: (process.env.NODE_ENV !== 'production' && debug == true) ? true : false,
        controls: Array.from(new Set(controls)),
      });

      console.log(this.player);
      this.player.on('error', this.onPlayerError);
      this.player.on('timeupdate', this.onTimeupdate);
    }

    componentDidUpdate = () => {
      const { props } = this;
      const {
        debug,
        controls: propControls
      } = props;
      this.instantiatePlyrJs({ debug, propControls, props });
    }

    onTimeupdate = () => {
      const plyr = this.player;
      // console.log({ plyr });
      // console.log('onTimeupdate', { currentTime: plyr.currentTime, seeking: plyr.seeking });
      this.playerStates = {
        currentTime: plyr?.currentTime || 0,
        playing: plyr?.playing || false,
        volume: plyr?.volume || 1,
        muted: plyr?.muted || false,
        speed: plyr?.speed || 1,
        loop: plyr?.loop || false
      };
    }

    render() {
      const { props } = this;
      const {
        classes,
        src,
        videoPlayerClassName,
        // debug,
        // controls: propControls
      } = props;
      // const controls = [
      //   'play-large', // The large play button in the center
      //   'restart', // Restart playback
      //   'rewind', // Rewind by the seek time (default 10 seconds)
      //   'play', // Play/pause playback
      //   'fast-forward', // Fast forward by the seek time (default 10 seconds)
      //   'progress', // The progress bar and scrubber for playback and buffering
      //   'current-time', // The current time of playback
      //   'duration', // The full duration of the media
      //   'mute', // Toggle mute
      //   'volume', // Volume control
      //   'captions', // Toggle captions
      //   'settings', // Settings menu
      //   'pip', // Picture-in-picture (currently Safari only)
      //   'airplay', // Airplay (currently Safari only)
      //   // 'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
      //   'fullscreen', // Toggle fullscreen
      //   ...propControls
      // ];
      return (
        <div className={[videoPlayerClassName, classes.VideoPlayer].join(' ')} >
          <video src={src} ref={this.videoNode} />
          {/* <Plyr
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
                debug: process.env.NODE_ENV !== 'production' && debug == true,
                controls: Array.from(new Set(controls))
              }
            }
            onCanPlay={this.onCanPlay}
            ref={(player) => (this.player.current = player)}
            {...props}
          /> */}
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
        </div >
      );
    }

    static propTypes = {
      classes: PropTypes.object,
      debug: PropTypes.string,
      videoPlayerClassName: PropTypes.string,
      hlsConfig: PropTypes.object,
      src: PropTypes.string.isRequired,
      poster: PropTypes.string,
      controls: PropTypes.array
    };

    static defaultProps = {
      debug: 'false',
      poster: '',
      controls: [],
      videoPlayerClassName: ''
    }
  }
);
