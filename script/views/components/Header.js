import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import SearchBar from '@views/components/SearchBar';
import VideoList from '@views/components/VideoList';

const styles = {
  Header: {
    height: '10vh',
    display: 'grid',
    gridTemplateColumns: '173px calc(100vw - 173px)',
    alignItems: 'center'
  },
  HeaderMobile: {
    gridTemplateColumns: '50px calc(100vw - 50px)',
  },
  Logo: {
    margin: 'auto',
    marginTop: '10px',
    // paddingTop: '20px',
    paddingRight: '20px',
    backgroundImage: 'url("/assets/icon/logo.png")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    width: '100%',
    height: '100%',
    cursor: 'pointer'
  },
  LogoMobile: {
    padding: '0px 10px 0 0px',
    backgroundPosition: 'unset',
  },
  HeaderContxt: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    alignItems: 'center'
  },
  HeaderContxtMobile: {
    justifyContent: 'flex-start'
  },
  SearchButton: {
    padding: '0'
  },
  MenuTrigger: {
    width: '10%',
    marginRight: '10px',
    backgroundImage: 'url("/assets/icon/menu.png")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: '40px',
    height: '100%',
    cursor: 'pointer'
  },
  MenuTriggerMobile: {
    marginLeft: '2vw',
    marginRight: 'unset',
    backgroundImage: 'url("/assets/icon/down-arrows.png")',
    '-webkit-transform': 'rotate(30deg)',
    '-moz-transform': 'rotate(30deg)',
    '-ms-transform': 'rotate(30deg)',
    '-o-transform': 'rotate(30deg)',
    transform: 'rotate(30deg)'
  }
};

const useStyles = makeStyles(styles);

function Header({ className, logoClassName, contxtClassNameHeader, searchSubmit, isMobile, videoList }) {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (event, payload) => {
    if (typeof (payload) === 'boolean') {
      return setDrawerOpen(payload);
    }
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(!drawerOpen);
  };
  return (
    <header className={[className || classes.Header, isMobile ? classes.HeaderMobile : ''].join(' ')}>
      <Link to='/' >
        <div className={[logoClassName || classes.Logo, isMobile ? classes.LogoMobile : ''].join(' ')} />
      </Link>
      <div className={[contxtClassNameHeader || classes.HeaderContxt, isMobile ? classes.HeaderContxtMobile : ''].join(' ')}>
        <SearchBar width={`calc(85% - ${styles.MenuTrigger.marginRight})`} onSubmit={(searchText) => searchSubmit(searchText)} />
        {videoList.length > 0 && <div className={[classes.MenuTrigger, isMobile ? classes.MenuTriggerMobile : ''].join(' ')} onClick={toggleDrawer} />}
      </div>
      {
        videoList.length > 0 && (
          <SwipeableDrawer anchor='right' open={drawerOpen} onClose={(event, ...arg) => toggleDrawer(event, false, ...arg)} onOpen={(event, ...arg) => toggleDrawer(event, true, ...arg)}>
            <Divider />
            <VideoList isMobile={isMobile} videoList={videoList} onLinkClick={toggleDrawer} />
          </SwipeableDrawer>
        )
      }
    </header >
  );
}

Header.propTypes = {
  className: PropTypes.string,
  logoClassName: PropTypes.string,
  contxtClassNameHeader: PropTypes.string,
  searchSubmit: PropTypes.func,
  isMobile: PropTypes.bool,
  videoList: PropTypes.array,
};

Header.defaultProps = {
  className: '',
  logoClassName: '',
  contxtClassNameHeader: '',
  searchSubmit: () => { },
  isMobile: false,
  videoList: []
};

export default Header;