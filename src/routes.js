import React from 'react';
import App from './components/App';
import LoginFormContainer from './components/user/LoginFormContainer';
import TopicListContainer from './components/topic/TopicListContainer';
import TopicSummaryContainer from './components/topic/summary/TopicSummaryContainer';
import SourceDetailsContainer from './components/source/details/SourceDetailsContainer';
import SourceCollectionDetailsContainer from './components/source/details/SourceCollectionDetailsContainer';
import SourceListContainer from './components/source/SourceListContainer';
import { hasCookies } from './lib/auth';
import { logout } from './actions/userActions';
import store from './store';
import { Route, IndexRoute } from 'react-router';

// We need to restrict some routes to only users that are logged in
function requireAuth(nextState, replace) {
  if (!hasCookies()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
}

// Lets us have a fake '/logout' route
function onEnterLogout(nextState, replaceState) {
  store.dispatch(logout());
  replaceState('/login');
}

const appName = 'sources';

const topicRoutes = (
  <Route path="/topics" component={TopicListContainer} onEnter={requireAuth} >
    <Route path="/topic/:topicId" component={TopicSummaryContainer} onEnter={requireAuth} />
  </Route>
);

const sourceRoutes = (
  <Route path="/sources" >
    <IndexRoute component={SourceListContainer} onEnter={requireAuth} />
    <Route path="/source/:sourceId/details" component={SourceDetailsContainer} onEnter={requireAuth} />
    <Route path="/collection/:sourceId/details" component={SourceCollectionDetailsContainer} onEnter={requireAuth} />
  </Route>
);

let appRoutes = null;
switch (appName) {
  case 'topics':
    appRoutes = topicRoutes;
    break;
  case 'sources':
    appRoutes = sourceRoutes;
    break;
  default:
    appRoutes = null;
}

const routes = (
  <Route path="/" component={App}>
    {appRoutes}
    <Route path="/login" component={LoginFormContainer} />
    <Route path="/logout" onEnter={onEnterLogout} />
  </Route>
);

export default routes;
