import colors from 'vuetify/es5/util/colors'
const URLS = {
  LOGIN: '/api/login',
  GET_SERVERS: '/api/getServers',
  ARRAY_STATUS: '/api/arrayStatus',
  SERVER_STATUS: '/api/serverStatus',
  VM_STATUS: '/api/vmStatus',
  USB_ATTACH: '/api/usbAttach',
  PCI_ATTACH: '/api/pciAttach',
  GPU_SWAP: '/api/gpuSwap',
  VM_EDIT: '/api/editVM',
  VM_CREATE: '/api/createVM',
  DOCKER_STATUS: '/api/dockerStatus',
  MQTT_DEVICE_CHANGE: '/api/mqttDevices',
  DELETE_SERVER: '/api/deleteServer',
  PROXY_IMAGE: '/state',
  PROXY_IMAGE_VM: '/plugins',
}

export default {
  telemetry: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Unraid-API',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons',
      },
    ],
  },

  publicRuntimeConfig: {
    keyStorage: process.env.KeyStorage,
  },
  privateRuntimeConfig: {
    mqttBroker: process.env.MQTTBroker,
    mqttPort: process.env.MQTTPort,
    mqttUser: process.env.MQTTUser,
    mqttPass: process.env.MQTTPass,
    mqttBaseTopic: process.env.MQTTBaseTopic,
    HOST: process.env.NUXT_HOST,
    PORT: process.env.NUXT_PORT,
    NODE_ENV: process.env.NODE_ENV,
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/vuetify',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // '~/mqtt',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  serverMiddleware: [
    // Will register file from project api directory to handle /api/* requires

    { path: URLS.LOGIN, handler: '~/api/login.ts' },
    { path: URLS.GET_SERVERS, handler: '~/api/getServers.ts' },
    { path: URLS.VM_STATUS, handler: '~/api/changeVMStatus.ts' },
    { path: URLS.DOCKER_STATUS, handler: '~/api/changeDockerStatus.ts' },
    { path: URLS.ARRAY_STATUS, handler: '~/api/changeArrayStatus.ts' },
    { path: URLS.SERVER_STATUS, handler: '~/api/changeServerStatus.ts' },
    { path: URLS.USB_ATTACH, handler: '~/api/usbAttach.ts' },
    { path: URLS.PCI_ATTACH, handler: '~/api/pciAttach.ts' },
    { path: URLS.GPU_SWAP, handler: '~/api/gpuSwap.ts' },
    { path: URLS.VM_EDIT, handler: '~/api/editVM.ts' },
    { path: URLS.VM_CREATE, handler: '~/api/createVM.ts' },
    { path: URLS.MQTT_DEVICE_CHANGE, handler: '~/api/mqttDevices.ts' },
    { path: URLS.DELETE_SERVER, handler: '~/api/deleteServer.ts' },
    { path: URLS.PROXY_IMAGE, handler: '~/api/proxyImage.ts' },
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  vuetify: {
    theme: {
      light: {
        primary: colors.blue.darken2,
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3,
      },
      dark: {
        primary: colors.blue.darken2,
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3,
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
