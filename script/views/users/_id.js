import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import VideoList from '@views/components/VideoList';

const avatarStyle = {
  width: '2.5em',
  height: '2.5em'
};

const styles = {
  titleBlock: {
    padding: '0em 0.6250em',
    lineHeight: avatarStyle.height,
    display: 'inline-flex'
  },
  avatar: avatarStyle,
  title: {
    display: 'inline-flex',
    alignItems: 'center'
  },
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
      const { videoSearch, userDetailed, classes } = this.props;

      return (
        <div>
          <div className={classes.titleBlock}>
            <Avatar alt={userDetailed.account} src={userDetailed.avater} className={classes.avatar} />
            <p className={classes.title}>{userDetailed.account}</p>
          </div>
          <VideoList videoList={videoSearch} userName={userDetailed.account} listRootClassName={classes.listRootClassName} imageListClassName={classes.imageListClassName} />
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
