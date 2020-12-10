/* eslint-disable nuxt/no-cjs-in-config */
const colors = require('vuetify/lib/util/colors').default
module.exports = {
  server: {
    port: 3010,
    host: 'localhost',
    timing: false
  },
  /** Page transition */
  pageTransition: 'page',
  /** Allow auto component imports */
  components: true,

  target: 'server',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: null,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#49c5b6' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/vuetify',
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // PWA
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
  // Vuetify config
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#49c5b6',
          accent: '#ff8601',
          secondary: colors.blue.accent1,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    },
    defaultAssets: {
      font: {
        family: 'Roboto'
      },
      icons: 'mdi'
    }
  },
  /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
  axios: {},
  /*
     ** vuetify module configuration
     ** https://github.com/nuxt-community/vuetify-module
     */
  auth: {
    resetOnError: true,
    cookie: false,
    redirect: {
      login: '/auth/login',
      logout: '/',
      home: '/b/dashboard',
      callback: '/auth/login'
    },

    strategies: {
      business: {
        provider: 'laravel/sanctum',
        url: '/',

        endpoints: {
          csrf: {
            url: '/sanctum/csrf-cookie'
          },
          login: {
            url: '/api/b/login'
          },
          logout: {
            url: '/api/b/logout',
            method: 'POST'
          },
          user: {
            url: '/api/b/user'
          }
        }
      },
      customer: {
        provider: 'laravel/sanctum',
        url: '/',

        endpoints: {
          csrf: {
            url: '/sanctum/csrf-cookie'
          },
          login: {
            url: '/api/c/login'
          },
          logout: {
            url: '/api/c/logout',
            method: 'POST'
          },
          user: {
            url: '/api/c/user'
          }
        }
      }
    }
  },
  /*
     ** Build configuration
     */
  build: {
    transpile: ['vee-validate']
    /*
       ** You can extend webpack config here
       */
  }
}
