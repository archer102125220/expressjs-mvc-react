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
          <VideoPlayer src='/video/video-[Kamigami&VCB-Studio] Yahari Ore no Seishun Lovecome wa Machigatte Iru. Zoku [OVA][Ma10p_1080p][x265_flac]-parker-1626973814647.mp4' />
          <VideoPlayer src='/video/video-[WMSUB][Digimon Adventure][LAST EVOLUTION-Kizuna][BDRip][Childhood translation][BIG5][1080P]-parker-1626973814647.mp4' />
          <VideoPlayer src='/video/video-Yuru Camp 01 [BD 1920x1080 HEVC-10bit AAC ASSx2]-parker-1626973814647.mp4' />
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
