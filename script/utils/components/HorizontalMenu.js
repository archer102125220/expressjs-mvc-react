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
  horizontalMenuBlock: {
    position: 'fixed',
    zIndex: 1300,
    inset: '0',
    outline: 0,
  },
  horizontalMenuBackground: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    zIndex: -1,
    position: 'fixed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(255 255 255 / 50%)',
    '-webkit-tap-highlight-color': 'transparent',
    outline: 0,
  },
  horizontalMenuTopBackground: {
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
  horizontalMenuBottomBackground: {
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
  horizontalMenu: {
    ...position,
    display: 'flex',
    width: '100vw',
    overflowX: 'auto',
    top: '35vh',
    left: 0,
    '& > *': {
      display: '-webkit-box',
    }
  },
  horizontalMenuTopBlock: {
    ...position,
    height: '100%',
    top: 0,
    right: 0
  },
  horizontalMenuBottomBlock: {
    ...position,
    height: '100%',
    bottom: 0,
    left: 0
  }
};

const useStyles = makeStyles(styles);

export default function HorizontalMenu({ children, topBlock, BottomBlock, open: propOpen, onOpen, onClose }) {
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
    <div className={classes.horizontalMenuBlock} onClick={toggleDrawer} onKeyDown={toggleDrawer} tabIndex='0'>
      <div className={classes.horizontalMenuBackground} />
      <div className={[classes.horizontalMenuTopBackground, 'slide-bl'].join(' ')} />
      <div className={classes.horizontalMenuTopBlock} >
        {topBlock}
      </div>
      <div className={[classes.horizontalMenuBottomBackground, 'slide-tr'].join(' ')} />
      <div className={classes.horizontalMenuBottomBlock} >
        {BottomBlock}
      </div>
      <div className={classes.horizontalMenu} >
        {children}
      </div>
    </div>
  );
}

HorizontalMenu.propTypes = {
  children: PropTypes.node,
  topBlock: PropTypes.node,
  BottomBlock: PropTypes.node,
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func
};

HorizontalMenu.defaultProps = {
  open: false
};