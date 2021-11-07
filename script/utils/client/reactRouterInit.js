import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import PropTypes from 'prop-types';
import LayoutSwitch from '@views/layouts/LayoutSwitch';
import { routeComponent, redirectComponent } from '@config/router/reactRouter';
import { store } from '@utils/client/reduxInit';

function setServerDate() {
  if (typeof (window) !== 'object') return;
  const __EXPRESS_MVC_REACT_DATA__ = document.getElementById('__EXPRESS_MVC_REACT_DATA__');
  if (typeof (__EXPRESS_MVC_REACT_DATA__) === 'object' && __EXPRESS_MVC_REACT_DATA__ !== null) {
    const serverData = JSON.parse(__EXPRESS_MVC_REACT_DATA__.textContent);
    const Page = routeComponent.find(page => page.pageName === serverData.pageName)?.component || {};
    const WrappedComponent = Page?.WrappedComponent;
    if (WrappedComponent) {
      const WrappedComponentDefaultProps = WrappedComponent?.defaultProps || {};
      Page.WrappedComponent.defaultProps = { ...WrappedComponentDefaultProps, ...serverData.serverProps };
    } else {
      const defaultProps = Page.defaultProps || {};
      Page.defaultProps = { ...defaultProps, ...serverData.serverProps };
    }
  }
}
class Root extends Component {
  state = {}

  static propTypes = {
    history: PropTypes.object.isRequired,
    children: PropTypes.node
  };

  async shouldComponentUpdate(nextProps) {
    const { history } = nextProps;
    const location = history.location || {};
    const Page = routeComponent.find(page => page.path === location.pathname)?.component || {};
    if (typeof (Page?.getInitialProps) === 'function') {
      try {
        const newDefaultProps = await Page.getInitialProps({ ...history, isServer: false, reduxStore: store });
        const defaultProps = Page.defaultProps || {};
        const WrappedComponent = Page?.WrappedComponent;
        if (WrappedComponent) {
          const WrappedComponentDefaultProps = WrappedComponent?.defaultProps || {};
          Page.WrappedComponent.defaultProps = { ...WrappedComponentDefaultProps, ...newDefaultProps };
        } else {
          Page.defaultProps = { ...defaultProps, ...newDefaultProps };
        }
        this.forceUpdate();
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.log(error);
      }
      return false;
    }
    return true;
  }

  render() {
    const { props } = this;
    return (
      <Switch  {...props}>
        <LayoutSwitch  {...props}>
          {
            routeComponent.map(value => renderRoutes(value, props))
          }
          {
            redirectComponent.map(value => renderRedirects(value, props))
          }
        </LayoutSwitch>
      </Switch>);
  }
}

const RouterRoot = withRouter(Root);

const renderRoutes = (r, props) => {
  const { key, exact, path, component: Component } = r;
  return (
    <Route
      {...props}
      key={`route-${key}`}
      exact={exact}
      path={path}
      render={(props) => <Component {...props} />}
    />
  );
};

const renderRedirects = (r, props) => {
  const { key, exact, to, From } = r;
  return (
    <Redirect
      {...props}
      key={`redirect-${key}`}
      exact={exact}
      from={From}
      to={to}
    />
  );
};

const Router = props => {
  setServerDate();
  return (
    <ConnectedRouter {...props}>
      <RouterRoot {...props} />
    </ConnectedRouter>
  );
};

export default Router;