import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import VideoList from '@views/components/VideoList';

const styles = {
  listRootClassName: {
    width: '90%',
    margin: 'auto'
  },
  imageListClassName: {
    width: '100%'
  }
};

const mapStateToProps = (state) => ({
  videoSearch: state.videoList?.videoSearch,
  isMobile: state.system?.isMobile,
});

const mapDispatchToProps = (dispatch) => ({
  GET_VideoSearch: (payload, callback, loading) => dispatch({ type: 'videoList/GET_VideoSearch', payload, callback, loading }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(
  class VideoIndex extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    componentDidMount = () => {
    }

    static getInitialProps({ serverData, isServer, reduxStore, match }) {
      if (isServer === true) {
        reduxStore.dispatch({ type: 'videoList/SAVE_video_search', payload: [...serverData.videoList] });
      } else {
        try {
          reduxStore.dispatch({ type: 'videoList/GET_VideoSearch', payload: { videoName: match.pageQuerys.videoName } });
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') console.log(error);
        }
      }
    }

    render() {
      const { videoSearch, classes } = this.props;

      return (
        <div>
          <VideoList videoList={videoSearch} listRootClassName={classes.listRootClassName} imageListClassName={classes.imageListClassName} />
        </div>
      );
    }

    static propTypes = {
      classes: PropTypes.object,
      videoSearch: PropTypes.array,
      GET_VideoSearch: PropTypes.func,
      isMobile: PropTypes.bool
    };

    static defaultProps = {
    }
  }
));
