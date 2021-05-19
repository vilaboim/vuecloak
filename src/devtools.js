import { setupDevtoolsPlugin } from '@vue/devtools-api'

let isAlreadyInstalled = false
const INSPECTOR_ID = 'vuecloak'

export function devtoolsPlugin (app, keycloak) {
  const keycloakProperties = Object.keys(keycloak).filter(key => typeof keycloak[key] !== 'function')
  const keycloakMethods = ['loadUserProfile', 'loadUserInfo']

  setupDevtoolsPlugin(
    {
      id: INSPECTOR_ID,
      label: 'Vuecloak',
      packageName: 'vuecloak',
      homepage: 'https://github.com/vilaboim/vuecloak',
      app,
    },
    (api) => {
      if (!isAlreadyInstalled) {
        api.addInspector({
          id: INSPECTOR_ID,
          label: 'Vuecloak',
          icon: 'lock',
          treeFilterPlaceholder: 'Search for property...'
        })

        api.on.getInspectorTree(payload => {
          if (payload.inspectorId === INSPECTOR_ID) {
            payload.rootNodes = [
              {
                id: 'properties',
                label: 'Properties',
                children: keycloakProperties.map((property) => ({
                  id: property,
                  label: property
                }))
              },
              {
                id: 'methods',
                label: 'Methods',
                children: keycloakMethods.map((property) => ({
                  id: property,
                  label: property
                }))
              }
            ]
          }
        })

        api.on.getInspectorState(async (payload) => {
          if (payload.inspectorId === INSPECTOR_ID) {
            const nodeId = payload.nodeId

            if (keycloakMethods.includes(nodeId)) {
              payload.state = {
                [nodeId]: {
                  key: nodeId,
                  value: await keycloak[nodeId](),
                  editable: false
                }
              }
            } else {
              payload.state = {
                [nodeId]: {
                  key: nodeId,
                  value: keycloak[nodeId],
                  editable: false
                }
              }
            }
          }
        })
      }

      isAlreadyInstalled = true

      api.notifyComponentUpdate()
    }
  )
}
