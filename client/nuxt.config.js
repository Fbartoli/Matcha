import colors from 'vuetify/es5/util/colors'

export default {
  env: {
    // example: use process.env.baseUrl
    baseUrl: 'http://localhost:3000', // || process.env.BASE_URL ||
    // serverUrl: 'http://10.13.9.11:8080/api', // || process.env.SERVER_URL
    // serverUrlIo: 'http://10.13.9.11:8080'
    serverUrl: 'http://localhost:8080/api', // || process.env.SERVER_URL
    serverUrlIo: 'http://localhost:8080'
  },
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/main.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: ['~/plugins/socket.io.js'],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/axios'
  ],

  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    // treeShake: true,
    customVariables: ['~/assets/variables.scss'],
    theme: {
      themes: {
        primary: {
          primary: colors.indigo.darken1,
          accent: colors.grey.darken3,
          secondary: colors.deepPurple.darken1,
          info: colors.purple.accent2,
          warning: colors.amber.base,
          error: colors.deepOrange.lighten4,
          success: colors.lightGreen.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
