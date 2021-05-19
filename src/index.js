import Keycloak from 'keycloak-js'
import { devtoolsPlugin } from './devtools'

function isFunction (value) {
  return typeof value === 'function'
}

function init (config, options) {
  const keycloak = Keycloak(config)

  keycloak.onReady = function () {
    isFunction(options.onReady) && options.onReady(keycloak)
  }

  keycloak.onAuthSuccess = function () {
    isFunction(options.onAuthSuccess) && options.onAuthSuccess(keycloak)
  }

  keycloak.onAuthError = function () {
    isFunction(options.onAuthError) && options.onAuthError(keycloak)
  }

  keycloak.onAuthRefreshSuccess = function () {
    isFunction(options.onAuthRefreshSuccess) && options.onAuthRefreshSuccess(keycloak)
  }

  keycloak.onAuthRefreshError = function () {
    isFunction(options.onAuthRefreshError) && options.onAuthRefreshError(keycloak)
  }

  keycloak.onAuthLogout = function () {
    isFunction(options.onAuthLogout) && options.onAuthLogout(keycloak)
  }

  keycloak.onTokenExpired = function () {
    isFunction(options.onTokenExpired) && options.onTokenExpired(keycloak)
  }

  keycloak
    .init(options.init)
    .then((authenticated) => {
      isFunction(options.onInitSuccess) &&
        options.onInitSuccess(authenticated)
    })
    .catch((error) => {
      isFunction(options.onInitError)
        ? options.onInitError(error)
        : console.error(error)
    })

  return keycloak
}

let installed = false

export const Vuecloak = {
  install: (app, options) => {
    if (installed) return

    installed = true

    const keycloak = init(options.config, options)

    app.config.globalProperties.$keycloak = keycloak
    app.provide('$keycloak', keycloak)

    devtoolsPlugin(app, keycloak)
  }
}

