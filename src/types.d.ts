import type {
  KeycloakInitOptions, KeycloakConfig, KeycloakInstance, KeycloakError,
} from 'keycloak-js';

export interface IApp {
  component: Function;
  config: {
    compilerOptions:any;
    errorHandler: any;
    globalProperties: any;
    isNativeTag: Function;
    optionMergeStrategies: any;
    performance: boolean;
    warnHandler: any;
  }
  directive: Function;
  mixin: Function;
  mount: Function;
  provide: Function;
  unmount: Function;
  use: Function;
  version: string;
}

export interface IOptions {
  init: KeycloakInitOptions;
  config: KeycloakConfig;
  onReady: (keycloak: KeycloakInstance) => void;
  onAuthSuccess: (keycloak: KeycloakInstance) => void;
  onAuthError: (keycloak: KeycloakInstance) => void;
  onAuthRefreshSuccess: (keycloak: KeycloakInstance) => void;
  onAuthRefreshError: (keycloak: KeycloakInstance) => void;
  onAuthLogout: (keycloak: KeycloakInstance) => void;
  onTokenExpired: (keycloak: KeycloakInstance) => void;
  onInitSuccess: (authenticated: boolean) => void;
  onInitError: (keycloak: KeycloakError) => void;
}
