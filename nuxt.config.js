/* eslint-disable nuxt/no-cjs-in-config */
const colors = require('vuetify/lib/util/colors').default
module.exports = {
  // Nuxt server
  server: {
    port: process.env.PORT || 3000,
    host: 'localhost',
    timing: false
  },

  // disable ssr
  // ssr: false,

  // target: 'static',

  // Vue router
  router: {
    middleware: ['auth']
  },

  /**
   * The loading indicator
   */
  loadingIndicator: {
    name: 'rectangle-bounce',
    color: '#3B8070',
    background: 'white'
  },

  /**
   * server middleware
   * This is where the backend routes go
   *
   */
  serverMiddleware: {
    '/api': '~/backend/app.js'
  },

  /**
   * modern property
   */
  modern: 'server',

  /** Page transition */
  pageTransition: 'page',

  /** Allow auto component imports */
  components: true,

  /** Application mode */
  // ssr: false,

  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: null,
    title: 'Events254',
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
  css: ['@/assets/main.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/axios',
    '~/plugins/veevalidate.js',
    '~/plugins/moment.js'
  ],
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
    '@nuxtjs/dotenv',
    // Auth
    '@nuxtjs/auth-next',
    // Site maps module
    '@nuxtjs/sitemap',
    // HTTP module
    '@nuxt/http'
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
        family: 'Poppins'
      },
      icons: 'mdi'
    }
  },

  /**
   * PWA options
   *
   */
  pwa: {
    meta: {
      name: 'Events254',
      theme_color: '#49c5b6',
      ogDescription: 'Events254 is an application for event organisers and anyone who is looking for something to do',
      ogHost: 'events.opensource254.co.ke',
      twitterCard: 'summary',
      twitterSite: '@stanleymasinde_'
    },
    manifest: {
      name: 'Events254'
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: '/api/events/.*',
          strategyOptions: {
            cacheName: 'events-cache'
          },
          strategyPlugins: [{
            use: 'Expiration',
            config: {
              maxEntries: 100,
              maxAgeSeconds: 300
            }
          }]
        }
      ]
    }
  },
  /**
   * Sitemap
   * https://sitemap.nuxtjs.org/guide/configuration
   */
  sitemap: {
    // options
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
    strategies: {
      cookie: {
        user: {
          property: 'user'
        },
        cookie: {
          options: {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            expires: 365 * 24 * 60 * 60 * 1000
          }
        },
        endpoints: {
          login: { url: '/api/auth/login', method: 'POST' },
          logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/auth/user', method: 'get' }
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
