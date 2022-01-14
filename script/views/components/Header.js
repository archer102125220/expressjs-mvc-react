import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import SearchBar from '@views/components/SearchBar';

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

function Header({ classes, className, logoClassName, contxtClassNameHeader, searchSubmit, isMobile }) {
  return (
    <header className={[className || classes.Header, isMobile ? classes.HeaderMobile : ''].join(' ')}>
      <Link to='/' >
        <div className={[logoClassName || classes.Logo, isMobile ? classes.LogoMobile : ''].join(' ')} />
      </Link>
      <div className={[contxtClassNameHeader || classes.HeaderContxt, isMobile ? classes.HeaderContxtMobile : ''].join(' ')}>
        <SearchBar width={`calc(85% - ${styles.MenuTrigger.marginRight})`} onSubmit={(searchText) => searchSubmit(searchText)} />
        <div className={[classes.MenuTrigger, isMobile ? classes.MenuTriggerMobile : ''].join(' ')} />
      </div>
    </header>
  );
}

Header.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  logoClassName: PropTypes.string,
  contxtClassNameHeader: PropTypes.string,
  searchSubmit: PropTypes.func,
  isMobile: PropTypes.bool,
};

Header.defaultProps = {
  classes: {},
  className: '',
  logoClassName: '',
  contxtClassNameHeader: '',
  searchSubmit: () => { },
  isMobile: false
};

export default withStyles(styles)(Header);