import React, { Component } from 'react';
// import { Route, Switch, routerRedux, withRouter, Redirect } from 'dva/router';
import { Route, Redirect, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
// import { ConnectedRouter } from 'react-router-redux';
import PropTypes from 'prop-types';
import LayoutSwitch from '@views/layouts/LayoutSwitch';
import IndexPage from '@views/index';
// const { ConnectedRouter } = routerRedux;

const routeComponent = [
  { key: 'root', path: '/', exact: true, component: IndexPage },
];
const redirectComponent = [
  { key: 'root', exact: true, to: '/', From: '/index' },
];

class Root extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    // history: PropTypes.any,
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
  return (
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
    // <ConnectedRouter {...props}>
    //   <RouterRoot {...props}>
    //     <Switch  {...props}>
    //       <LayoutSwitch  {...props}>
    //         {
    //           routeComponent.map(value => renderRoutes(value, props))
    //         }
    //         {
    //           redirectComponent.map(value => renderRedirects(value, props))
    //         }
    //       </LayoutSwitch>
    //     </Switch>
    //   </RouterRoot>
    // </ConnectedRouter>
  );
};

export default Router;