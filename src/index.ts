import Keycloak from 'keycloak-js';
import type { KeycloakError } from 'keycloak-js';
import { IApp, IOptions } from './types';
import devtoolsPlugin from './devtools';

function isFunction(value: Function | undefined) {
  return typeof value === 'function';
}

function init(config: IOptions['config'], options: IOptions) {
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
    .then((authenticated: boolean) => {
      if (isFunction(options.onInitSuccess)) options.onInitSuccess(authenticated);
    })
    .catch((error: KeycloakError) => {
      if (isFunction(options.onInitError)) return options.onInitError(error);

      // eslint-disable-next-line no-console
      return console.error(error);
    });

  return keycloak;
}

let installed = false;

const Vuecloak = {
  install: (app: IApp, options: IOptions) => {
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
