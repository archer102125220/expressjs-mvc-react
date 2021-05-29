import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import PropTypes from 'prop-types';
import LayoutSwitch from '@views/layouts/LayoutSwitch';
import { routeComponent, redirectComponent } from '@config/router/reactRouter';

function setServerDate() {
  if (typeof (window) !== 'object') return;
  const serverData = JSON.parse(document.getElementById('__EXPRESS_MVC_DATA__').textContent);
  const Page = routeComponent.find(page => page.pageName === serverData.pageName)?.component || {};
  const defaultProps = Page.defaultProps;
  if (typeof (Page.getServerData) === 'function') {
    const newDefaultProps = Page.getServerData(serverData.serverPageData);
    if (!defaultProps) {
      Page.defaultProps = { ...newDefaultProps };
    } else {
      Page.defaultProps = { ...defaultProps, ...newDefaultProps };
    }
  } else {
    Page.defaultProps = { ...defaultProps, ...serverData.serverProps };
  }
}

class Root extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    children: PropTypes.any
  };

  render() {
    const { children } = this.props;
    return children;
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
      <RouterRoot {...props}>
        <Switch  {...props}>
          <LayoutSwitch  {...props}>
            {
              routeComponent.map(value => renderRoutes(value, props))
            }
            {
              redirectComponent.map(value => renderRedirects(value, props))
            }
          </LayoutSwitch>
        </Switch>
      </RouterRoot>
    </ConnectedRouter>
  );
};

export default Router;