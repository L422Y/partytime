// https://nuxt.com/docs/api/configuration/nuxt-config
const privateRuntimeConfig = import("./nuxt.private.config")
export default defineNuxtConfig({
    modules: ["@pinia/nuxt"],
    css: ['@/src/assets/scss/base.scss'],
    devServer: {
        port: 5173
    },
    runtimeConfig: {
        public: {
            spotifyRedirectURL: "http://localhost:5173/",
            spotifyCallbackURL: "http://localhost:5173/spotify-callback",
            spotifyClientId: "e25c017bdd6b476aaece984d99a0fd5c",
        },
        ...privateRuntimeConfig
    }
})
