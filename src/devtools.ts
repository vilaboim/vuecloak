import { setupDevtoolsPlugin } from '@vue/devtools-api';
import { IApp, VuecloakInstance, VuecloakCustomInspectorState } from './types';

let isAlreadyInstalled = false;
const INSPECTOR_ID = 'vuecloak';

export default function devtoolsPlugin(app: IApp, keycloak: VuecloakInstance) {
  const keycloakProperties = Object.keys(keycloak).filter((key) => typeof keycloak[key] !== 'function');
  const keycloakMethods = ['loadUserInfo', 'loadUserProfile'];

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
          treeFilterPlaceholder: 'Search for property...',
        });

        api.on.getInspectorTree((payload) => {
          if (payload.inspectorId === INSPECTOR_ID) {
            const rootNodes = [
              {
                id: 'properties',
                label: 'Properties',
                children: keycloakProperties.map((property) => ({
                  id: property,
                  label: property,
                })),
              },
            ];

            if (keycloak.authenticated) {
              rootNodes.push({
                id: 'methods',
                label: 'Methods',
                children: keycloakMethods.map((property) => ({
                  id: property,
                  label: property,
                })),
              });
            }

            payload.rootNodes = rootNodes;
          }
        });

        api.on.getInspectorState(async (payload) => {
          if (payload.inspectorId === INSPECTOR_ID) {
            const { nodeId } = payload;

            if (keycloak.authenticated) {
              const state: VuecloakCustomInspectorState = {
                [nodeId]: {
                  key: nodeId,
                  editable: false,
                },
              };

              state[nodeId].value = keycloakMethods.includes(nodeId)
                ? await keycloak[nodeId]()
                : keycloak[nodeId];

              payload.state = state;
            }
          }
        });
      }

      isAlreadyInstalled = true;
    },
  );
}
