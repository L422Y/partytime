<script lang="ts" setup>
import { useAppStore } from "~/stores/app"
import LoginView from "~/components/LoginView.vue"
import { usePlayerStore } from "~/stores/player"

const pv = ref()
const appStore = useAppStore()
onMounted(() => {
  usePlayerStore().$state.nowPlayingMinimized = false
})
</script>

<template>
  <ClientOnly>
    <PlaylistsView
      v-if="appStore?.spotifyUser && appStore?.spotifyAccessToken"
      ref="pv"
    />
    <div v-else>
      <LoginView/>
    </div>
  </ClientOnly>
</template>
