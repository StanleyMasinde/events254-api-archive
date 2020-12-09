/* eslint-disable nuxt/no-cjs-in-config */

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
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - Events254',
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
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
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
