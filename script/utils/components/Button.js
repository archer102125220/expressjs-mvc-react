
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { enquireScreen, unenquireScreen  } from 'enquire-js';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

class MaterialButton extends Component {
  constructor(props) {
    super(props);
    this.anchorRef = React.createRef();
    this.state = {
      open: false,
      selectedIndex: 0,
      options: [],
    };
  }

  componentDidMount = () => {
    const { buttons } = this.props;
    this.setState({ options: buttons });
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile ? true : false,
      });
    }/*, '(max-width: 1024px)' */);
  }

  componentWillUnmount = () => {
    unenquireScreen(this.enquireHandler);
  }

  static getDerivedStateFromProps(props, state) {
    const { buttons } = props;
    const { options } = state;
    if (buttons !== options) {
      return { ...state, options: buttons };
    }

    return null;
  }

  handleClick = (event) => {
    const { selectedIndex, options } = this.state;
    options[selectedIndex].event(event);
  }

  handleMenuItemClick = (event, key) => {
    this.setState({ selectedIndex: key, open: false });
  }

  handleToggle = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  }

  handleClose = event => {
    const { anchorRef } = this;
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  }

  render() {
    const { state, props, anchorRef } = this;
    const { open, selectedIndex, options } = state;
    const { children, buttons, vertical, buttonStyle, split } = props;
    const config = {
      variant: 'contained',
      color: 'primary',
      size: (split === 'true' || split === true) ? 'small' : 'medium',
      orientation: (vertical === true || vertical === 'true') ? 'vertical' : 'horizontal',
      ...props,
    };
    if (split === 'true' || split === true) {
      return (<Grid container direction='column' alignItems='center'>
        <Grid item xs={12}>
          {/* https://zh-hant.reactjs.org/docs/refs-and-the-dom.html  */}
          <ButtonGroup {...config} ref={anchorRef} aria-label='split button'>
            <Button onClick={this.handleClick}>{((options[selectedIndex] || {}).element || '')}</Button>
            <Button
              aria-controls={open ? 'split-button-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-label='select merge strategy'
              aria-haspopup='menu'
              onClick={this.handleToggle}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList id='split-button-menu'>
                      {options.map(({ element, config }, key) => (
                        <MenuItem
                          key={key}
                          selected={key === selectedIndex}
                          onClick={event => this.handleMenuItemClick(event, key)}
                          {...(config || {})}
                        >
                          {element}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Grid>
      </Grid>);
    } else if (Array.isArray(buttons)) {
      return (<ButtonGroup {...config}>
        {
          buttons.map(({ element, event, config }, key) => {
            return (<Button key={key} className={buttonStyle} onClick={event} {...(config || {})}>
              {element}
            </Button>);
          })
        }
      </ButtonGroup>);
    } else {
      return (
        <Button {...config}>
          {children}
        </Button >
      );
    }
  }
  static propTypes = {
    children: PropTypes.node,
    buttons: PropTypes.array,
    vertical: PropTypes.any,
    buttonStyle: PropTypes.object,
    split: PropTypes.any,
    icon: PropTypes.any,
  }
}

export default MaterialButton;