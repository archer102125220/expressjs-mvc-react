import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Plyr from 'plyr-react';
import CreateIcon from '@material-ui/icons/Create';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import TitleIcon from '@material-ui/icons/Title';
import Chip from '@material-ui/core/Chip';

const playerStyle = {
  '& > .plyr': {
    width: '50vw',
    height: '50vh',
    marginBottom: '10px'
  },
};

const styles = {
  plyr: playerStyle,
  videoUploader: {
    '& > .plyr': playerStyle,
    '& .MuiDialog-paperWidthSm': {}
  },
  subtitleButton: {
    marginBottom: '10px'
  }
};

export default withStyles(styles)(
  class VideoUploader extends Component {
    constructor(props) {
      super(props);
      this.state = {
        uploadVideoList: new Array(),
        openDialog: false,
        selectedRenameVideoKey: -1,
        videoPlayerOptionList: new Array(),
        videoOptionList: new Array(),
        uploadSubtitleList: new Array(),
        tempRename: ''
      };
    }


    shouldComponentUpdate(nextProps) {
      if (this.state.uploadVideoList.length > 0 && nextProps.uploaded === true) {
        this.setState({
          uploadVideoList: new Array(),
          videoPlayerOptionList: new Array(),
          videoOptionList: new Array(),
          uploadSubtitleList: new Array()
        });
        nextProps.getUploadVideo(new Array());
        nextProps.getUploadSubtitleList(new Array());
        nextProps.getVideoOptionList(new Array());
        nextProps.onUploaded();
        return false;
      }
      return true;
    }

    getUploadVideo = (e) => {
      const fileList = e.target.files;
      const { uploadVideoList, videoPlayerOptionList, videoOptionList } = this.state;
      for (let i = 0; i < fileList.length; i++) {
        uploadVideoList.push(fileList[i]);
      }
      uploadVideoList.forEach((uploadVideo, key) => {

        videoPlayerOptionList[key] = {
          type: 'video',
          sources: [
            {
              // https://stackoverflow.com/questions/38903665/getting-video-file-details-using-filereaderhttps://stackoverflow.com/questions/38903665/getting-video-file-details-using-filereader
              src: URL.createObjectURL(uploadVideo)
            }
          ]
        };
        videoOptionList[key] = {
          originName: uploadVideo.name,
          timestamp: Date.now(),
          newName: ''
        };
      });
      this.setState({ uploadVideoList, videoPlayerOptionList });
      if (typeof (this.props.getUploadVideo) === 'function') {
        this.props.getUploadVideo(uploadVideoList);
      }
      this.getVideoOptionList(videoOptionList);
    }

    getUploadSubtitleList = (e, key) => {
      const fileList = e.target.files;
      const { uploadSubtitleList, videoOptionList } = this.state;
      uploadSubtitleList[key] = fileList[0];
      videoOptionList[key]['ssa-file'] = fileList[0].name;
      videoOptionList[key]['ssa-burn'] = 1;
      this.setState({ uploadSubtitleList });
      if (typeof (this.props.getUploadSubtitleList) === 'function') {
        this.props.getUploadSubtitleList(uploadSubtitleList);
      }
      this.getVideoOptionList(videoOptionList);
    }
    handleDeleteUploadSubtitleList = (e, key) => {
      const { uploadSubtitleList, videoOptionList } = this.state;
      uploadSubtitleList[key] = null;
      videoOptionList[key]['ssa-file'] = '';
      videoOptionList[key]['ssa-burn'] = 0;
      this.setState({ uploadSubtitleList });
      if (typeof (this.props.getUploadSubtitleList) === 'function') {
        this.props.getUploadSubtitleList(uploadSubtitleList);
      }
      this.getVideoOptionList(videoOptionList);
    }

    updateTempRename = (e) => {
      this.setState({ tempRename: e.target.value });
    }

    videoRename = (key) => {
      const { videoOptionList, tempRename } = this.state;
      videoOptionList[key].newName = tempRename;

      this.setState({ tempRename: '' });
      this.handleSelectedRenameVideoKey(-1);
      this.getVideoOptionList(videoOptionList);
    }

    getVideoOptionList = (videoOptionList) => {
      const { uploadVideoList } = this.state;
      this.setState({ videoOptionList });
      if (typeof (this.props.getVideoOptionList) === 'function') {
        this.props.getVideoOptionList(videoOptionList, uploadVideoList);
      }
    }

    handleToggleDialog = (openDialog) => {
      this.setState({ openDialog });
    }

    handleSelectedRenameVideoKey = (selectedRenameVideoKey) => {
      this.setState({ selectedRenameVideoKey });
    }

    renderDialog = () => {
      const { uploadVideoList, openDialog, videoPlayerOptionList, videoOptionList, tempRename } = this.state;
      return (<Dialog
        open={openDialog}
        onClose={() => this.handleToggleDialog(false)}
        scroll="paper"
        maxWidth={false}
      >
        <DialogContent dividers={true}>
          <DialogContentText component='div'>
            {
              uploadVideoList.map(
                (uploadVideo, index) => (
                  this.renderAccordin(
                    videoOptionList[index]?.newName || uploadVideo.name,
                    <Plyr source={videoPlayerOptionList[index]} />,
                    index,
                    tempRename
                  )
                )
              )
            }
          </DialogContentText>
        </DialogContent>
      </Dialog>);
    }

    renderAccordin = (accordionHead, accordionChildren, key, tempAccordionHead) => {
      const { selectedRenameVideoKey, uploadSubtitleList } = this.state;
      const { classes, disabled } = this.props;
      return (
        <Accordion key={key}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} >
            <Typography component='div'>
              <label
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.stopPropagation()}
              >
                {
                  selectedRenameVideoKey !== key ?
                    (<span>
                      <IconButton color="primary" component="span" onClick={(event) => this.handleSelectedRenameVideoKey(key, event)}>
                        <CreateIcon />
                      </IconButton>
                      {accordionHead}
                    </span>) :
                    (<span>
                      <TextField
                        label="標題"
                        variant="outlined"
                        value={tempAccordionHead || accordionHead}
                        // error={accordionHead === ''}
                        onChange={this.updateTempRename}
                      />
                      <IconButton color="secondary" component="span" onClick={(event) => this.handleSelectedRenameVideoKey(-1, event)}>
                        <CancelRoundedIcon />
                      </IconButton>
                      <IconButton color="primary" component="span" onClick={(event) => this.videoRename(selectedRenameVideoKey, event)}>
                        <CheckCircleRoundedIcon />
                      </IconButton>
                    </span>)
                }
              </label>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography component='div'>
              {
                (typeof (uploadSubtitleList[key]) === 'object' && uploadSubtitleList[key] !== null) ?
                  (<Chip
                    avatar={<TitleIcon />}
                    label={uploadSubtitleList[key].name || ''}
                    onDelete={(e) => this.handleDeleteUploadSubtitleList(e, key)}
                    className={classes.subtitleButton}
                  />) :
                  (<label>
                    <input accept=".ass, .ssa" style={{ display: 'none' }} disabled={disabled} type="file" onChange={(e) => this.getUploadSubtitleList(e, key)} />
                    <Fab variant="extended" color="primary" component="span" disabled={disabled} disableFocusRipple={disabled} disableRipple={disabled} className={classes.subtitleButton}>
                      <CloudUploadIcon />上傳字幕檔
                    </Fab>
                  </label>)
              }
              <span>
                {accordionChildren}
              </span>
            </Typography>
          </AccordionDetails>
        </Accordion>);
    }

    render() {
      const { uploadVideoList } = this.state;
      const { classes, children, uploaderConfig, multiple, disabled, className } = this.props;
      return (
        <div className={classes.videoUploader}>
          <label>
            {/* https://stackoverflow.com/questions/56454681/why-is-no-file-type-returned-when-adding-an-mkv-file-to-a-file-input */}
            <input accept="video/*,.mkv" style={{ display: 'none' }} type="file" disabled={disabled} multiple={multiple} {...uploaderConfig} onChange={this.getUploadVideo} />
            <Fab variant="extended" color="primary" component="span" disabled={disabled} disableFocusRipple={disabled} disableRipple={disabled} className={className}>
              <CloudUploadIcon />{children}
            </Fab>
          </label>
          {
            uploadVideoList.length > 0 && <Button variant="outlined" color="primary" onClick={() => this.handleToggleDialog(true)}>瀏覽待上傳清單({uploadVideoList.length})</Button>
          }
          {this.renderDialog()}
        </div>
      );
    }

    static propTypes = {
      classes: PropTypes.object,
      uploaderConfig: PropTypes.object,
      disabled: PropTypes.bool,
      children: PropTypes.node,
      className: PropTypes.string,
      multiple: PropTypes.bool,
      getUploadVideo: PropTypes.func,
      onUploaded: PropTypes.func,
      uploaded: PropTypes.bool,
      getVideoOptionList: PropTypes.func,
      getUploadSubtitleList: PropTypes.func
    };
    static defaultProps = {
      disabled: false,
      multiple: true,
      uploaded: false
    }
  }
);