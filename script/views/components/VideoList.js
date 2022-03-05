import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
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
    width: '30em',
    // height: 450,
    paddingLeft: '0.5em',
    paddingRight: '0.5em',
    paddingBottom: '0.5em'
  },
  item: {
    flexShrink: 'unset',
    flexGrow: 1
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

function VideoList({ videoList, onLinkClick, isMobile, imageListClassName, listRootClassName }) {
  const classes = useStyles();

  return (
    <List className={[listRootClassName].join(' ')}>
      {
        videoList.map((video) => {
          const videoNameArray = video.videoName.split('.');
          const extname = videoNameArray[videoNameArray.length - 1];
          const fileName = video.videoName.replace(new RegExp(`.${extname}$`), '');
          const videoName = fileName.split('_-_')[1];
          const userName = video.userList?.account;

          return (
            (typeof (video) === 'object' && video !== null) &&
            <ImageList rowHeight={180} className={[classes.imageList, isMobile ? 'scale-up-center' : '', imageListClassName].join(' ')} key={fileName}>
              <Link to={`/videos/player/${video.id}`} className={classes.item} onClick={onLinkClick}>
                <ImageListItem className={classes.item}>
                  <img src={video.videoScreenshot} alt={videoName} />
                  <ImageListItemBar
                    title={videoName}
                    subtitle={<span>by: {userName || ''}</span>}
                  // actionIcon={
                  //   <IconButton aria-label={`info about ${ videoName }`} className={classes.icon}>
                  //     <InfoIcon />
                  //   </IconButton>
                  // }
                  />
                </ImageListItem>
              </Link>
            </ImageList>
          );
        })
      }
    </List>
  );
}

VideoList.propTypes = {
  videoList: PropTypes.array,
  onLinkClick: PropTypes.func,
  isMobile: PropTypes.bool,
  imageListClassName: PropTypes.string,
  listRootClassName: PropTypes.string,
};

export default VideoList;