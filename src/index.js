import Keycloak from 'keycloak-js';
import devtoolsPlugin from './devtools';

function isFunction(value) {
  return typeof value === 'function';
}

function init(config, options) {
  const keycloak = Keycloak(config);

  keycloak.onReady = () => {
    if (isFunction(options.onReady)) options.onReady(keycloak);
  };

  keycloak.onAuthSuccess = () => {
    if (isFunction(options.onAuthSuccess)) options.onAuthSuccess(keycloak);
  };

  keycloak.onAuthError = () => {
    if (isFunction(options.onAuthError)) options.onAuthError(keycloak);
  };

  keycloak.onAuthRefreshSuccess = () => {
    if (isFunction(options.onAuthRefreshSuccess)) options.onAuthRefreshSuccess(keycloak);
  };

  keycloak.onAuthRefreshError = () => {
    if (isFunction(options.onAuthRefreshError)) options.onAuthRefreshError(keycloak);
  };

  keycloak.onAuthLogout = () => {
    if (isFunction(options.onAuthLogout)) options.onAuthLogout(keycloak);
  };

  keycloak.onTokenExpired = () => {
    if (isFunction(options.onTokenExpired)) options.onTokenExpired(keycloak);
  };

  keycloak
    .init(options.init)
    .then((authenticated) => {
      if (isFunction(options.onInitSuccess)) options.onInitSuccess(authenticated);
    })
    .catch((error) => {
      if (isFunction(options.onInitError)) return options.onInitError(error);

      // eslint-disable-next-line no-console
      return console.error(error);
    });

  return keycloak;
}

let installed = false;

const Vuecloak = {
  install: (app, options) => {
    if (installed) return;

    installed = true;

    const keycloak = init(options.config, options);

    app.config.globalProperties.$keycloak = keycloak;
    app.provide('$keycloak', keycloak);

    const IS_DEV = process.env.NODE_ENV === 'development';
    const IS_CLIENT = typeof window !== 'undefined';

    if (IS_DEV && IS_CLIENT) {
      devtoolsPlugin(app, keycloak);
    }
  },
};

export { Vuecloak };
export default Vuecloak;
