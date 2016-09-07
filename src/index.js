import 'babel-polyfill';
import 'intl';
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Router from 'react-router/lib/Router';
import hashHistory from 'react-router/lib/hashHistory';
import { syncHistoryWithStore } from 'react-router-redux';
import ga from 'ga-react-router';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { hasCookies, getCookies } from './lib/auth';
import { loginWithKey } from './actions/userActions';
import store from './store';
import { getBrandColors } from './styles/colors';

const APP_DOM_ELEMENT_ID = 'app';
const DEFAULT_LOCALE = 'en';

/**
 * Call this from your own appIndex.js with some routes to start up your app.  Do not
 * refer to this file as an entry point directly.
 */
export default function initializeApp(routes) {
  // necessary lines for Material-UI library to work
  injectTapEventPlugin();

  // Create an enhanced history that syncs navigation events with the store
  const history = syncHistoryWithStore(hashHistory, store);

  // Track hits by listening for changes to the current location. The listener is called once immediately.
  history.listen(location => ga('send', location.pathname));

  const muiTheme = getMuiTheme({
    fontFamily: 'Lato, sans',
    palette: {
      primary1Color: getBrandColors().dark,
      accent1Color: getBrandColors().light,
    },
  });

  const renderApp = () => {
    ReactDOM.render(
      <MuiThemeProvider muiTheme={muiTheme}>
        <Provider store={store}>
          <IntlProvider locale={DEFAULT_LOCALE}>
            <Router history={history}>
              {routes}
            </Router>
          </IntlProvider>
        </Provider>
      </MuiThemeProvider>,
      document.getElementById(APP_DOM_ELEMENT_ID)
    );
  };

  // load any cookies correctly
  if (hasCookies()) {
    const cookies = getCookies();
    store.dispatch(loginWithKey(cookies.email, cookies.key))
      .then((results) => {
        if ({}.hasOwnProperty.call(results, 'status') && (results.status !== 200)) {
          if (window.location.href.indexOf('login') === -1) {
            window.location = '/#/login';
          }
        }
        renderApp();
      });
  } else {
    renderApp();
  }
}
