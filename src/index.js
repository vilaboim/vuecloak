import Keycloak from 'keycloak-js'

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

  keycloak.onTokenExpired = function () {
    isFunction(options.onTokenExpired) && options.onTokenExpired(keycloak)
  }

  keycloak
    .init(options.init)
    .then((authenticated) => {
      isFunction(options.onInitSuccess) &&
        options.onInitSuccess(authenticated)
    })
    .catch((err) => {
      const error = Error('Could not initialized keycloak-js adapter')

      isFunction(options.onInitError)
        ? options.onInitError(error, err)
        : console.error(error, err)
    })

  return keycloak
}

let installed = false

const Vuecloak = {
  install: (app, _options) => {
    if (installed) return

    installed = true

    const defaultOptions = {
      init: {
        onLoad: 'login-required',
        checkLoginIframe: false
      }
    }
    const options = {
      ...defaultOptions,
      ..._options
    }

    const keycloak = init(options.config, options)

    app.config.globalProperties.$keycloak = keycloak
    app.provide('$keycloak', keycloak)
  }
}

export { Vuecloak }
