import VuetifyLoaderPlugin from "vuetify-loader/lib/plugin";
import pkg from "./package";

export default {
  mode: "universal",

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons"
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },

  /*
   ** Global CSS
   */
  css: ["~/assets/style/index.scss"],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/vuetify",
    { src: "~/plugins/chartist", mode: "client" },
    "plugins/mqtt.js"
  ],

  /*
   ** Nuxt.js modules
   */
   modules: ['@nuxtjs/axios'],
  /*
   ** Axios module configuration
   */


  /*
   ** Build configuration
   */
  build: {
    transpile: ["vuetify/lib"],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {},
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
};
