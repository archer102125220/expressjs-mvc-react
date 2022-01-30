import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Logo from '@server/public/assets/logo.svg';
import '@server/public/stylesheets/App.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import VideoUploader from '@utils/components/VideoUploader';
import Button from '@utils/components/Button';
import Head from '@utils/components/Head';
// https://stackoverflow.com/questions/57012780/adding-css-to-react-ssr-components


const mapStateToProps = (state) => ({
  pageInfo: state.system?.pageInfo || {},
  title: state.system?.title,
});

const mapDispatchToProps = (dispatch) => ({
  GET_UserList: (payload, callback, loading) => dispatch({ type: 'userList/GET_UserList', payload, callback, loading }),
  POST_VideoUpload: (payload, onUploadProgress, callback, loading) => dispatch({ type: 'videoList/POST_VideoUpload', payload, callback, loading, onUploadProgress }),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
        uploadVideoList: [],
        videoOptionList: [],
        uploadSubtitleList: [],
        uploaded: false,
        loading: false,
      };
    }

    static getInitialProps({ serverData, isServer, reduxStore }) {
      if (isServer === true) {
        reduxStore.dispatch({ type: 'system/SAVE_title', payload: serverData.title });
      } else {
        try {
          reduxStore.dispatch({ type: 'system/GET_HomePage' });
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') console.log(error);
        }
      }
    }

    getUploadVideo = (uploadVideoList) => {
      this.setState({ uploadVideoList });
    }
    getUploadSubtitleList = (uploadSubtitleList) => {
      this.setState({ uploadSubtitleList });
    }
    getVideoOptionList = (videoOptionList) => {
      this.setState({ videoOptionList });
    }

    handleUpload = () => {
      const { uploadVideoList, uploadSubtitleList, videoOptionList } = this.state;
      const debugLogData = { video: [], subtitle: [], videoOptionList: '' };
      // https://www.gushiciku.cn/pl/gfcM/zh-tw
      const formData = new FormData();
      debugLogData.videoOptionList = JSON.stringify(videoOptionList);
      formData.append('videoOptionList', JSON.stringify(videoOptionList));
      for (let i = 0; i < uploadVideoList.length; i++) {
        let video = uploadVideoList[i];
        debugLogData.video.push(video);
        formData.append('video', video);
        let subtitle = uploadSubtitleList[i];
        if (typeof (subtitle) === 'object' && subtitle !== null) {
          debugLogData.subtitle.push(subtitle);
          formData.append('video', subtitle);
        }
      }
      const loading = bool => this.setState({ loading: bool });
      // console.log(debugLogData, this.onUploadProgress, this.onUploaded, loading);
      this.props.POST_VideoUpload(formData, this.onUploadProgress, this.onUploaded, loading);
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
          <Head><title>私人YouTube</title></Head>
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
            <VideoUploader getUploadVideo={this.getUploadVideo} getVideoOptionList={this.getVideoOptionList} getUploadSubtitleList={this.getUploadSubtitleList} uploaded={this.state.uploaded} onUploaded={() => this.setState({ uploaded: false })} >上傳影片</VideoUploader>
            <Button onClick={this.handleUpload} disabled={this.state.loading}>確認上傳</Button>
          </header>
        </div>);
    }

    static propTypes = {
      children: PropTypes.node,
      history: PropTypes.any,
      title: PropTypes.string,
      POST_VideoUpload: PropTypes.func
    };

    static defaultProps = {
      title: '12345'
    }
  }
);