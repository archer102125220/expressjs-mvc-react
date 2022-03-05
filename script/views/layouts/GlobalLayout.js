import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserHistory } from '@utils/client/reduxInit';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Header from '@views/components/Header';
import Footer from '@views/components/Footer';

const styles = {
  body: {
    minHeight: '85vh',
  }
};

const mapStateToProps = (state) => ({
  users: state.userList?.userList || [],
  isMobile: state.system?.isMobile || false,
  videoList: state.videoList?.videoList || [],
});

const mapDispatchToProps = (dispatch) => ({
  GET_UserList: (payload, callback, loading) => dispatch({ type: 'userList/GET_UserList', payload, callback, loading }),
  goToRoute: (path, callback) => {
    // dispatch(BrowserHistory.push(path));
    BrowserHistory.push(path);
    if (callback) { callback(); }
  },
  GET_VideoList: (payload, callback, loading) => dispatch({ type: 'videoList/GET_VideoList', payload, callback, loading })
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(
  class GlobalLayout extends Component {
    state = {
      searchText: ''
    }

    componentDidMount() {
      this.props.GET_VideoList();
      const PageQuerys = {};
      const location = this.props.history?.location || {};
      const queryString = location.search?.split('?') || [];
      const queryArray = queryString[1]?.split('&') || [];
      queryArray.map((element) => {
        const query = element.split('=');
        PageQuerys[query[0]] = query[1];
      });
      if (typeof (PageQuerys.videoName) === 'string') {
        this.setState({
          searchText: PageQuerys.videoName
        });
      }
    }

    searchSubmit = (searchText) => {
      this.props.goToRoute({
        // https://www.codegrepper.com/code-examples/javascript/set+query+params+react+router
        pathname: '/videos',
        search: '?videoName=' + searchText
      });
    }

    render() {
      const { children, isMobile, videoList, classes } = this.props;

      return (
        <Typography component='div'>
          <Header
            searchSubmit={this.searchSubmit}
            isMobile={isMobile}
            videoList={videoList}
            searchText={this.state.searchText}
          />
          <div className={classes.body} >
            {children}
          </div>
          <Footer />
        </Typography>
      );
    }

    static propTypes = {
      children: PropTypes.node,
      GET_UserList: PropTypes.func,
      isMobile: PropTypes.bool,
      GET_VideoList: PropTypes.func,
      videoList: PropTypes.array,
      classes: PropTypes.object,
      goToRoute: PropTypes.func,
      history: PropTypes.object
    }
  }
));
