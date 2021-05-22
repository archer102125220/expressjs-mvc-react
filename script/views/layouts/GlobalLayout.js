import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'dva';
// import { connect } from 'react-redux';
// import _ from 'lodash';
// import { routerRedux } from 'dva/router';
// import Typography from '@material-ui/core/Typography';

// const mapStateToProps = (state) => ({
//   users: state.userList?.userList || [],
//   // users: _.get(state, 'userList.userList', []),
// });

// const mapDispatchToProps = (dispatch) => ({
//   SOCKET_UserList: (payload, callback, loading) => {
//     console.log({ dispatch, loading });
//     // dispatch({ type: 'userList/SOCKET_UserList', payload, callback, loading });
//   },
//   goToRoute: (path, callback) => {
//     // dispatch(routerRedux.push(path));
//     if (callback) { callback(); }
//   }
// });

export default /*connect(mapStateToProps, mapDispatchToProps)(*/
  class GlobalLayout extends Component {
    state = {
    }

    render() {
      const { children } = this.props;

      return (
        <div>{children}</div>
        // <Typography component='div'>
        //   {children}
        // </Typography>
      );
    }

    static propTypes = {
      children: PropTypes.any
    }
  }
/*);*/
