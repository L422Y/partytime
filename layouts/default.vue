<template>
  <main id="app">
    <Logout v-if="isAuthenticated"/>
    <NuxtPage/>
    <NowPlaying mode="normal"/>
  </main>
</template>
<script lang="ts" setup>
import { useAppStore } from "~/stores/app"

const appStore = useAppStore()
const isAuthenticated = computed(() => appStore.$state.isAuthenticated)
</script>

<style lang="scss">
main#app {
  font-family: 'Roboto', "Helvetica Neue", sans-serif;
  font-size: 16px;
}
</style>
