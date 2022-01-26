import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import VideoPlayer from '@utils/components/VideoPlayer';

function VideoList({ videoList }) {

  return (
    <List>
      {
        videoList.map((video, index) => (
          typeof (video.video) === 'string' &&
          <Fragment key={index}>
            <div>{video.videoName.split('_-_')[1]}</div>
            <ListItem div>
              <VideoPlayer src={video.video} controls={['download']} />
            </ListItem>
            <Divider />
          </Fragment>
        ))
      }
    </List>
  );
}

VideoList.propTypes = {
  videoList: PropTypes.array,
};

export default VideoList;