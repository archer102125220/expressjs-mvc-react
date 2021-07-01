import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Plyr from 'plyr-react';

const plyr = {
  '& > .plyr': {
    width: '50vw',
    height: '50vh',
    marginBottom: '10px'
  },
};

const styles = {
  plyr,
  videoUploader: {
    '& > .plyr': plyr,
    '& .MuiDialog-paperWidthSm': {}
  }
};

export default withStyles(styles)(
  class VideoUploader extends Component {
    constructor(props) {
      super(props);
      this.state = {
        uploadVideoList: new Array(),
        openDialog: false
      };
    }

    getUploadVideo = (e) => {
      const fileList = e.target.files;
      const uploadVideoList = this.state.uploadVideoList;
      for (let i = 0; i < fileList.length; i++) {
        uploadVideoList.push(fileList[i]);
      }
      this.setState({ uploadVideoList });
      if (typeof (this.props.getUploadVideo) === 'function') {
        this.props.getUploadVideo(uploadVideoList);
      }
    }

    handleToggleDialog = (openDialog) => {
      this.setState({ openDialog });
    }

    render() {
      const { uploadVideoList, openDialog } = this.state;
      const { classes, children, uploaderConfig, multiple, disabled, className } = this.props;
      return (
        <div className={classes.videoUploader}>
          <label>
            {/* https://stackoverflow.com/questions/56454681/why-is-no-file-type-returned-when-adding-an-mkv-file-to-a-file-input */}
            <input accept="video/*,.mkv" style={{ display: 'none' }} type="file" disabled={disabled === 'true'} multiple={multiple === 'true'} {...uploaderConfig} onChange={this.getUploadVideo} />
            <Fab variant="extended" color="primary" component="span" disabled={disabled === 'true'} className={className}>
              <CloudUploadIcon />{children}
            </Fab>
          </label>
          {
            uploadVideoList.length > 0 && <Button variant="outlined" color="primary" onClick={() => this.handleToggleDialog(true)}>瀏覽待上傳清單({uploadVideoList.length})</Button>
          }

          <Dialog
            open={openDialog}
            onClose={() => this.handleToggleDialog(false)}
            scroll="paper"
            maxWidth={false}
          >
            <DialogContent dividers={true}>
              <DialogContentText>
                {uploadVideoList.map((uploadVideo, index) => (
                  // https://stackoverflow.com/questions/38903665/getting-video-file-details-using-filereaderhttps://stackoverflow.com/questions/38903665/getting-video-file-details-using-filereader
                  <Plyr
                    key={index}
                    source={{
                      type: 'video',
                      sources: [
                        {
                          src: URL.createObjectURL(uploadVideo)
                        }
                      ]
                    }}
                  // options={
                  //   {
                  //     debug: true
                  //   }
                  // }
                  />
                ))}
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    static propTypes = {
      classes: PropTypes.object,
      uploaderConfig: PropTypes.object,
      disabled: PropTypes.string,
      children: PropTypes.node,
      className: PropTypes.string,
      multiple: PropTypes.string,
      getUploadVideo: PropTypes.func,
    };
    static defaultProps = {
      disabled: 'false',
      multiple: 'true',
    }
  }
);