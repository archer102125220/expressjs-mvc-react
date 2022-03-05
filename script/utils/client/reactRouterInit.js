import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import PropTypes from 'prop-types';
import LayoutSwitch from '@views/layouts/LayoutSwitch';
import { routeComponent, redirectComponent, ErrorPage } from '@config/router/reactRouter';
import { store } from '@utils/client/reduxInit';


const paramsRoute = routeComponent.filter(({ path }) => path.includes(':'));

function setServerDate() {
  if (typeof (window) !== 'object') return;

  const __EXPRESS_MVC_REACT_DATA__ = document.getElementById('__EXPRESS_MVC_REACT_DATA__');
  const serverData = JSON.parse(__EXPRESS_MVC_REACT_DATA__?.textContent || '{}') || {};
  if (typeof (serverData) === 'object' && serverData !== null) {
    const Page = serverData.pageName === 'Error' ?
      ErrorPage :
      routeComponent.find(page => page.pageName === serverData.pageName)?.component || {};
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
    match: PropTypes.object.isRequired,
    children: PropTypes.node
  };

  async shouldComponentUpdate(nextProps) {
    const { history, match } = nextProps;
    const location = history.location || {};
    const pathname = location.pathname.split('?')[0].split('/');
    const Page = (
      routeComponent.find(({ path }) => path === location.pathname)
      ||
      paramsRoute
        .filter((page) => {
          if (page.exact === true && page.path.length !== location.pathname.length) return false;
          const path = page.path.split('/');
          const match = path.filter((element, key) => {
            return element.includes(':') || element === pathname[key];
          });
          return path.length === match.length;
        })[0]
      ||
      {}
    );
    const PageComponent = Page?.component;
    if (typeof (PageComponent?.getInitialProps) === 'function') {
      try {
        const PagePath = Page?.path;
        const PageParams = {};
        const path = PagePath.split('/');
        pathname.map((element, key) => {
          if (path[key].includes(':')) {
            const params = path[key].split('=');
            PageParams[params[0].substring(1)] = element;
          }
        });
        const PageQuerys = {};
        const queryString = location.search?.split('?') || [];
        const queryArray = queryString[1]?.split('&') || [];
        queryArray.map((element) => {
          const query = element.split('=');
          PageQuerys[query[0]] = query[1];
        });

        const newDefaultProps = await PageComponent.getInitialProps({ ...history, match: { ...match, pagePath: PagePath, pageParams: PageParams, pageQuerys: PageQuerys }, isServer: false, reduxStore: store });
        if (newDefaultProps !== undefined && newDefaultProps !== null) {
          const defaultProps = PageComponent.defaultProps || {};
          const WrappedComponent = PageComponent?.WrappedComponent;
          if (WrappedComponent) {
            const WrappedComponentDefaultProps = WrappedComponent?.defaultProps || {};
            PageComponent.WrappedComponent.defaultProps = { ...WrappedComponentDefaultProps, ...newDefaultProps };
          } else {
            PageComponent.defaultProps = { ...defaultProps, ...newDefaultProps };
          }
          this.forceUpdate();
          return false;
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.log(error);
      }
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
  const { key, exact, path, component: Component, needToken, redirect, checkToken } = r;

  const __EXPRESS_MVC_REACT_DATA__ = document.getElementById('__EXPRESS_MVC_REACT_DATA__');
  const serverData = JSON.parse(__EXPRESS_MVC_REACT_DATA__?.textContent || '{}') || {};
  if (needToken === true && typeof (redirect) === 'string') {
    const token = localStorage.getItem('token');
    if (typeof (token) === 'string' && token.includes('Bearer ') === true) {//  reduxStore: store
      let invalidToken = false;
      if (typeof (checkToken) === 'function') {
        invalidToken = checkToken({ reduxStore: store, token });
      }
      if (invalidToken === true) return <Redirect {...props} key={`redirect-${key}`} exact={exact} from={path} to={redirect} />;
    }
  }
  return (
    <Route
      {...props}
      key={`route-${key}`}
      exact={exact}
      path={path}
      render={(props) => serverData.pageName === 'Error' ? <ErrorPage {...props} /> : <Component {...props} />}
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