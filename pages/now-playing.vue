<script lang="ts" setup>
import { useAppStore } from "~/stores/app"
import LoginView from "~/components/LoginView.vue"
import { usePlayerStore } from "~/stores/player"

const pv = ref()
const appStore = useAppStore()
onMounted(() => {
  usePlayerStore().$state.nowPlayingMinimized = true
})
onUnmounted(() => {
  usePlayerStore().$state.nowPlayingMinimized = false
})
</script>

<template>
  <ClientOnly>
    <template v-if="appStore.isAuthenticated">
      <NowPlaying mode="big"/>
    </template>
    <div v-else>
      <LoginView/>
    </div>
  </ClientOnly>
</template>
