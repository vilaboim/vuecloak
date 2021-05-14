# vuecloak

Vuecloak uses the official [Keycloak JS Adapter](https://github.com/keycloak/keycloak-documentation/blob/master/securing_apps/topics/oidc/javascript-adapter.adoc).

## Installation

### Using npm

`
npm i -S vuecloak
`

### Using Yarn

`
yarn add vuecloak
`

## Get started

### Config

It is mandatory to provide a config object containing your Keycloak **url**, **realm** and **clientId**.

```js
app
  .use(Vuecloak, {
    config: {
      url: 'KEYCLOAK_URL',
      realm: 'KEYCLOAK_REALM',
      clientId: 'KEYCLOAK_CLIENT_ID'
    }
  })
```

## Init options

You can provide custom [initialization options](https://github.com/keycloak/keycloak-documentation/blob/master/securing_apps/topics/oidc/javascript-adapter.adoc#initoptions) to Keycloak adapter through *init* property.

```js
app
  .use(Vuecloak, {
    init: {
      onLoad: 'login-required',
      checkLoginIframe: false
    }
  })
```

## Callback events

Vuecloak allows you to listen to Keycloak [callback events](https://www.keycloak.org/docs/latest/securing_apps/#callback-events).

|Key|Type|
|---|---|
|`onReady`|Function(keycloak)|
|`onAuthSuccess`|Function(keycloak)|
|`onAuthError`|Function(keycloak)|
|`onAuthRefreshSuccess`|Function(keycloak)|
|`onAuthRefreshError`|Function(keycloak)|
|`onAuthLogout`|Function(keycloak)|
|`onTokenExpired`|Function(keycloak)|
|`onInitSuccess`|Function(authenticated)|
|`onInitError`|Function(error)|

```js
app
  .use(Vuecloak, {
    onReady (keycloak) {
      ...
    },
    onInitSuccess (authenticated) {
      ...
    },
  })
```

## Usage

Vuecloak adds a *$keycloak* property with its [properties and methods](https://www.keycloak.org/docs/latest/securing_apps/#javascript-adapter-reference) to global Vue instance for you to use within your templates.

```html
<template>
  <button @click="$keycloak.logout">
    Logout
  </button>
</template>
```

### Inject

You can add *$keycloak* instance to your Vue setup too using [inject option](https://v3.vuejs.org/guide/component-provide-inject.html#provide-inject).

```js
import { inject, onBeforeMount } from 'vue'

export default {
  setup () {
    const keycloak = inject('$keycloak')

    onBeforeMount(() => {
      keycloak.loadUserInfo()
        .then((user) => {
          ...
        })
    })
  }
})
```

### Update token

Vuecloak has no strategy for keeping your tokens valid, so you need to do this on your own. A good way is to check it before API calls.

```js
axios.interceptors.request.use(async config => {
  await app.config.globalProperties.$keycloak.updateToken()

  config.headers.common.Authorization = `Bearer ${app.config.globalProperties.$keycloak.token}`

  return config
})
```

## Full example

```js
app
  .use(Vuecloak, {
    config: {
      url: 'KEYCLOAK_URL',
      realm: 'KEYCLOAK_REALM',
      clientId: 'KEYCLOAK_CLIENT_ID'
    },
    init: {
      onLoad: 'login-required',
      checkLoginIframe: false
    },
    onReady (keycloak) {...},
    onAuthSuccess (keycloak) {...},
    onAuthError (keycloak) {...},
    onAuthRefreshSuccess (keycloak) {...},
    onAuthRefreshError (keycloak) {...},
    onAuthLogout (keycloak) {...},
    onTokenExpired (keycloak) {...},
    onInitSuccess (authenticated) {...},
    onInitError (error) {...},
  })
```
