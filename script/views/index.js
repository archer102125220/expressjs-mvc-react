import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Logo from '@server/public/assets/logo.svg';
import '@server/public/stylesheets/App.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import VideoUploader from '@utils/components/VideoUploader';
import Button from '@utils/components/Button';
// https://stackoverflow.com/questions/57012780/adding-css-to-react-ssr-components


const mapStateToProps = (state) => ({
  pageInfo: state.system?.pageInfo || {},
  title: state.system?.title,
});

const mapDispatchToProps = (dispatch) => ({
  GET_UserList: (payload, callback, loading) => dispatch({ type: 'userList/GET_UserList', payload, callback, loading }),
  POST_VideoUploadTest: (payload, onUploadProgress, callback, loading) => dispatch({ type: 'userList/POST_VideoUploadTest', payload, callback, loading, onUploadProgress }),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
        title: 'state',
        uploadVideoList: [],
        uploaded: false,
        loading: false,
      };
    }

    static getInitialProps({ serverData, isServer, reduxStore }) {
      if (isServer === true) {
        // reduxStore.dispatch({ type: 'userList/TEST_UserList', payload: [1] });
        return { ...serverData };
      } else {
        reduxStore.dispatch({ type: 'system/GET_HomePage' });
      }
    }

    getUploadVideo = (uploadVideoList) => {
      this.setState({ uploadVideoList });
    }

    handleUpload = () => {
      const { uploadVideoList } = this.state;
      // https://www.gushiciku.cn/pl/gfcM/zh-tw
      const formData = new FormData();
      for (let i = 0; i < uploadVideoList.length; i++) {
        let video = uploadVideoList[i];
        formData.append('video', video);
      }
      const loading = bool => this.setState({ loading: bool });
      this.props.POST_VideoUploadTest(formData, this.onUploadProgress, this.onUploaded, loading);
    }

    onUploaded = () => {
      this.setState({ uploaded: true });
    }

    onUploadProgress = (e) => {
      console.log('onUploadProgress');
      console.log({ e });
    }

    render() {
      return (
        <div className='App'>
          <header className='App-header'>
            <Logo className='App-logo' alt='logo' />
            <h1>{this.props.title}</h1>
            <p>Welcome to {this.props.title}</p>
            <a
              className='App-link'
              href='https://reactjs.org'
              target='_blank'
              rel='noopener noreferrer'
            >
              Learn React
            </a>
            <Link to='/login' className='App-link'>登入/註冊</Link>
            <VideoUploader getUploadVideo={this.getUploadVideo} uploaded={this.state.uploaded} onUploaded={() => this.setState({ uploaded: false })} >上傳影片</VideoUploader>
            <Button onClick={this.handleUpload} disabled={this.state.loading}>確認上傳</Button>
          </header>
        </div >);
    }

    static propTypes = {
      children: PropTypes.node,
      history: PropTypes.any,
      title: PropTypes.string,
      POST_VideoUploadTest: PropTypes.func
    };

    static defaultProps = {
      title: '12345'
    }
  }
);