import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import MaterialLink from '@material-ui/core/Link';
import SearchBar from '@views/components/SearchBar';
import VideoList from '@views/components/VideoList';
import HorizontalMenu from '@utils/components/HorizontalMenu';

const styles = {
  Header: {
    height: '10vh',
    display: 'grid',
    gridTemplateColumns: '10.813em calc(100vw - 12em)',
    alignItems: 'center'
  },
  HeaderMobile: {
    gridTemplateColumns: '3.125em calc(100vw - 3.125em)',
  },
  Logo: {
    margin: 'auto',
    marginTop: '0.625em',
    // paddingTop: '1.250em',
    paddingRight: '1.250em',
    backgroundImage: 'url("/assets/icon/logo.png")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    width: '100%',
    height: '100%',
    cursor: 'pointer'
  },
  LogoMobile: {
    padding: '0 0.625em 0 0',
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
    marginRight: '0.625em',
    backgroundImage: 'url("/assets/icon/menu.png")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: '2.500em',
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
  },
  logOut: {
    textAlign: 'right',
    padding: '0 0.625em'
  },
  videoListRootClassName: {
    width: '90vw'
  },
  imageListClassName: {
    width: 'auto'
  }
};

const useStyles = makeStyles(styles);

function Header({ className, logoClassName, contxtClassNameHeader, searchSubmit, isMobile, videoList, searchText }) {
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

  const logOut = () => {
    localStorage.setItem('token', '');
  };

  const renderMenu = () => {
    return (
      <p className={classes.logOut}>
        <MaterialLink href='/logout' onClick={logOut} color={isMobile ? 'primary' : 'inherit'} >
          登出
        </MaterialLink>
      </p>
    );
  };

  return (
    <header className={[className || classes.Header, isMobile ? classes.HeaderMobile : ''].join(' ')}>
      <Link to='/' >
        <div className={[logoClassName || classes.Logo, isMobile ? classes.LogoMobile : ''].join(' ')} />
      </Link>
      <div className={[contxtClassNameHeader || classes.HeaderContxt, isMobile ? classes.HeaderContxtMobile : ''].join(' ')}>
        <SearchBar width={`calc(85% - ${styles.MenuTrigger.marginRight})`} onSubmit={searchSubmit} input={searchText} />
        {videoList.length > 0 && <div className={[classes.MenuTrigger, isMobile ? classes.MenuTriggerMobile : ''].join(' ')} onClick={toggleDrawer} />}
      </div>
      {

        videoList.length > 0 &&
          isMobile ? (
          <SwipeableDrawer anchor='right' open={drawerOpen} onClose={(event, ...arg) => toggleDrawer(event, false, ...arg)} onOpen={(event, ...arg) => toggleDrawer(event, true, ...arg)}>
            {renderMenu()}
            <Divider />
            <VideoList rowHeight={isMobile === false ? 180 : 100} listRootClassName={isMobile === true ? classes.videoListRootClassName : ''} imageListClassName={isMobile === true ? classes.imageListClassName : ''} videoList={videoList} onLinkClick={toggleDrawer} />
          </SwipeableDrawer>
        )
          :
          (
            <HorizontalMenu topBlock={renderMenu()} open={drawerOpen} onClose={(event, ...arg) => toggleDrawer(event, false, ...arg)} onOpen={(event, ...arg) => toggleDrawer(event, true, ...arg)}>
              <VideoList rowHeight={isMobile === false ? 180 : 100}  scaleUpCenter={true} listRootClassName={isMobile === true ? classes.videoListRootClassName : ''} imageListClassName={isMobile === true ? classes.imageListClassName : ''} videoList={videoList} onLinkClick={toggleDrawer} />
            </HorizontalMenu>
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
  searchText: PropTypes.string
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