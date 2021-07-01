import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
// https://stackoverflow.com/questions/57012780/adding-css-to-react-ssr-components


export default class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: true
    };
  }

  shouldComponentUpdate(nextProps, nextStatus) {
    const { messageType, messageText } = nextProps;
    let status = !((typeof (messageText) !== 'string' || messageText === '') && (typeof (messageType) !== 'string' || messageType === ''));
    if (status !== nextStatus.status) {
      this.setState({ status });
      return false;
    }
    return true;
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.props.onClose(event, reason);
  };

  render() {
    const { handleClose } = this;
    const { status } = this.state;
    const { messageType, messageText } = this.props;
    if ((typeof (messageText) !== 'string' || messageText === '') && (typeof (messageType) !== 'string' || messageType === '')) {
      return '';
    }
    return (
      <Snackbar open={status} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={1000} onClose={handleClose}>
        <MuiAlert elevation={6} onClose={handleClose} severity={messageType}>
          {messageText}
        </MuiAlert>
      </Snackbar>
    );
  }

  static propTypes = {
    messageType: PropTypes.string,
    messageText: PropTypes.string,
    onClose: PropTypes.func,
  };
}
