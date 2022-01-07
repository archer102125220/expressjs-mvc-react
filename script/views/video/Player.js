import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import VideoPlayer from '@views/components/VideoPlayer';


const styles = {

};

const mapStateToProps = (state) => ({
  videoList: state.videoList?.videoList,
});

const mapDispatchToProps = (dispatch) => ({
  GET_VideoList: (payload, callback, loading) => dispatch({ type: 'videoList/GET_VideoList', payload, callback, loading }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(
  class Player extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    componentDidMount = () => {
    }

    static getInitialProps({ serverData, isServer, reduxStore }) {
      if (isServer === true) {
        return { ...serverData };
      } else {
        try {
          reduxStore.dispatch({ type: 'videoList/GET_VideoList' });
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') console.log(error);
        }
      }
    }
    render() {
      const { videoList } = this.props;
      return (
        <div>
          {
            videoList
              .map((video, index) =>
                <VideoPlayer key={index} src={video.video} />
              )
          }
          {/* <VideoPlayer src='/video/video-[Kamigami&VCB-Studio] Yahari Ore no Seishun Lovecome wa Machigatte Iru. Zoku [OVA][Ma10p_1080p][x265_flac]-parker-1626973814647.mp4' />
          <VideoPlayer src='/video/video-[WMSUB][Digimon Adventure][LAST EVOLUTION-Kizuna][BDRip][Childhood translation][BIG5][1080P]-parker-1626973814647.mp4' />
          <VideoPlayer src='/video/video-Yuru Camp 01 [BD 1920x1080 HEVC-10bit AAC ASSx2]-parker-1626973814647.mp4' /> */}
        </div>
      );
    }

    static propTypes = {
      classes: PropTypes.object,
      videoList: PropTypes.array,
      GET_VideoList: PropTypes.func,
    };

    static defaultProps = {
    }
  }
));
