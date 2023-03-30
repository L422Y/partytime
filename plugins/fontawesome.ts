import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faDesktop, faMobilePhone } from '@fortawesome/free-solid-svg-icons'  // Add the icon you need here

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false

library.add({faDesktop, faMobilePhone})
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
