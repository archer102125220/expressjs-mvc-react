import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserHistory } from '@utils/client/reduxInit';
import Typography from '@material-ui/core/Typography';

const mapStateToProps = (state) => ({
  users: state.userList?.userList || [],
});

const mapDispatchToProps = (dispatch) => ({
  GET_UserList: (payload, callback, loading) => dispatch({ type: 'userList/GET_UserList', payload, callback, loading }),
  goToRoute: (path, callback) => {
    dispatch(BrowserHistory.push(path));
    if (callback) { callback(); }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(
  class GlobalLayout extends Component {
    state = {
    }

    componentDidMount() {
      this.props.GET_UserList();
    }

    render() {
      const { children } = this.props;

      return (
        // <div>{children}</div>
        <Typography component='div'>
          {children}
        </Typography>
      );
    }

    static propTypes = {
      children: PropTypes.any,
      TEST_UserList: PropTypes.func,
      GET_UserList: PropTypes.func
    }
  }
);
