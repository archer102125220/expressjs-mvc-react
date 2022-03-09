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
  userDetailed: state.userList?.userDetailed,
});

const mapDispatchToProps = (dispatch) => ({
  GET_VideoSearch: (payload, callback, loading) => dispatch({ type: 'videoList/GET_VideoSearch', payload, callback, loading }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(
  class Users_id extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    componentDidMount = () => {
    }

    static getInitialProps({ serverData, isServer, reduxStore, match }) {
      if (isServer === true) {
        reduxStore.dispatch({ type: 'userList/SAVE_user_detailed', payload: serverData.userDetailed });
        reduxStore.dispatch({ type: 'videoList/SAVE_video_search', payload: serverData.videoSearch });
      } else {
        try {
          reduxStore.dispatch({ type: 'userList/GET_UserDetailed', payload: match.pageParams.id });
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') console.log(error);
        }
      }
    }

    render() {
      const { videoSearch, userDetailed } = this.props;

      return (
        <div>
          {userDetailed.account}
          <VideoList videoList={videoSearch} />
        </div>
      );
    }

    static propTypes = {
      classes: PropTypes.object,
      videoSearch: PropTypes.array,
      isMobile: PropTypes.bool,
      userDetailed: PropTypes.object
    };

    static defaultProps = {
    }
  }
));
