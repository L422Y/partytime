// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt",
    "@nuxt-alt/proxy"
  ],
  css: [
    "@/src/assets/scss/base.scss",
    "@fortawesome/fontawesome-svg-core/styles.css"
  ],
  devServer: {
    port: 5173
  },
  runtimeConfig: {
    public: {
      fakeNumber: "+12125551212",
      voting: true,
      websocketServerEndpoint: "http://localhost:5174",
      spotifyRedirectUrl: "http://localhost:5173/",
      spotifyCallbackUrl: "http://localhost:5173/spotify-callback",
      spotifyClientId: "e25c017bdd6b476aaece984d99a0fd5c",
    },
  }
})
