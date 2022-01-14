import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserHistory } from '@utils/client/reduxInit';
import Typography from '@material-ui/core/Typography';
import Header from '@views/components/Header';
import Footer from '@views/components/Footer';

const mapStateToProps = (state) => ({
  users: state.userList?.userList || [],
  isMobile: state.system?.isMobile || false,
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
      // this.props.GET_UserList();
    }

    render() {
      const { children, isMobile } = this.props;

      return (
        <Typography component='div'>
          <Header searchSubmit={(searchText) => console.log({ searchText })} isMobile={isMobile} />
          {children}
          <Footer />
        </Typography>
      );
    }

    static propTypes = {
      children: PropTypes.node,
      GET_UserList: PropTypes.func,
      isMobile: PropTypes.bool
    }
  }
);
