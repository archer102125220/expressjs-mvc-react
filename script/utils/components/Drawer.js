import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const position = {
  flex: '1 0 auto',
  outline: 0,
  zIndex: 1200,
  position: 'fixed',
  flexDirection: 'column',
  '-webkit-overflow-scrolling': 'touch',
};

const styles = {
  drawerBlock: {
    position: 'fixed',
    zIndex: 1300,
    inset: '0',
    outline: 0,
  },
  drawerBackground: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    zIndex: -1,
    position: 'fixed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    '-webkit-tap-highlight-color': 'transparent',
    outline: 0,
  },
  drawerTopBackground: {
    ...position,
    display: 'flex',
    top: -100,
    right: -100,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '0 268px 268px 0',
    borderColor: 'transparent #cfbcd6 transparent transparent'
  },
  drawerBottomBackground: {
    ...position,
    display: 'flex',
    bottom: -100,
    left: -100,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '268px 0 0 268px',
    borderColor: 'transparent transparent transparent #cfbcd6'
  },
  drawer: {
    ...position,
    display: 'flex',
    width: '100vw',
    overflowX: 'auto',
    top: '30vh',
    left: 0,
    '& > *': {
      display: '-webkit-box',
    }
  },
  drawerTopBlock: {
    ...position,
    height: '100%',
    top: 0,
    right: 0
  },
  drawerBottomBlock: {
    ...position,
    height: '100%',
    bottom: 0,
    left: 0
  }
};

const useStyles = makeStyles(styles);

export default function Drawer({ children, topBlock, BottomBlock, open: propOpen, onOpen, onClose }) {
  const classes = useStyles();
  const [open, setOpen] = useState(propOpen);
  useEffect(() => {
    if (propOpen === true) {
      document.querySelector('body').style.overflow = 'hidden';
    } else {
      document.querySelector('body').style.overflow = '';
    }
    setOpen(propOpen);
  }, [propOpen]);
  const toggleDrawer = (...arg) => {
    console.log('toggleDrawer');
    if (open === false) {
      document.querySelector('body').style.overflow = 'hidden';
    } else {
      document.querySelector('body').style.overflow = '';
    }
    if (open === false && typeof (onOpen) === 'function') {
      onOpen(...arg);
    } else if (open === true && typeof (onClose) === 'function') {
      onClose(...arg);
    } else {
      setOpen(!open);
    }
  };
  if (open === false) return '';
  return (
    <div className={classes.drawerBlock} onClick={toggleDrawer} onKeyDown={toggleDrawer} tabIndex='0'>
      <div className={classes.drawerBackground} />
      <div className={[classes.drawerTopBackground, 'slide-bl'].join(' ')} />
      <div className={classes.drawerTopBlock} >
        {topBlock}
      </div>
      <div className={[classes.drawerBottomBackground, 'slide-tr'].join(' ')} />
      <div className={classes.drawerBottomBlock} >
        {BottomBlock}
      </div>
      <div className={classes.drawer} >
        {children}
      </div>
    </div>
  );
}

Drawer.propTypes = {
  children: PropTypes.node,
  topBlock: PropTypes.node,
  BottomBlock: PropTypes.node,
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func
};

Drawer.defaultProps = {
  open: false
};