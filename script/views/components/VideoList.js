import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
// import ListSubheader from '@material-ui/core/ListSubheader';
// import IconButton from '@material-ui/core/IconButton';
// import InfoIcon from '@material-ui/icons/Info';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  imageList: {
    width: 500,
    height: 450,
    paddingLeft: '10px',
    paddingRight: '10px'
  },
  item: {
    flexShrink: 'unset',
    flexGrow: 1
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

function VideoList({ videoList }) {
  const classes = useStyles();

  return (
    <List>
      {
        videoList.map((video, index) => (
          typeof (video.video) === 'string' &&
          <ImageList rowHeight={180} className={classes.imageList} key={index}>
            {
              videoList.map((video) => {
                const fileName = video.videoName.split('.')[0];
                const videoName = fileName.split('_-_')[1];
                const userName = video.userList.account;

                return (
                  <Link key={fileName} to={`/video/player/${video.id}`} className={classes.item}>
                    <ImageListItem className={classes.item}>
                      <img src={`/video/screenshot/${fileName}.png`} alt={videoName} />
                      <ImageListItemBar
                        title={videoName}
                        subtitle={<span>by: {userName}</span>}
                      // actionIcon={
                      //   <IconButton aria-label={`info about ${videoName}`} className={classes.icon}>
                      //     <InfoIcon />
                      //   </IconButton>
                      // }
                      />
                    </ImageListItem>
                  </Link>
                );
              })
            }
          </ImageList>
        ))
      }
    </List>
  );
}

VideoList.propTypes = {
  videoList: PropTypes.array,
};

export default VideoList;