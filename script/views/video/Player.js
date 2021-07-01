import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import VideoPlayer from '@views/components/VideoPlayer';


const styles = {

};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(
  class Player extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    componentDidMount = () => {
    }

    render() {
      return (
        <div>
          <VideoPlayer src='/video/video-Tate no Yuusha no Nariagari 16 [BD 1920x1080 HEVC x265 10bit ASSx2]-Marnie-1625073213454.mp4' />
          <VideoPlayer src='/video/video-[DMG] 甘城ブリリアントパーク 第01話「お客が来ない!」 [BDRip][AVC_AAC][720P][CHT](1C38355F)-1623743666230.mp4' />
          <VideoPlayer src='/assets/video/test_mp4_3.mp4' />
          <VideoPlayer src='/video/video-[WMSUB][Digimon Adventure][LAST EVOLUTION-Kizuna][BDRip][Childhood translation][BIG5][1080P]-Marnie-1625107838014.mp4' />
        </div>
      );
    }

    static propTypes = {
      classes: PropTypes.object,
    };

    static defaultProps = {
    }
  }
));
