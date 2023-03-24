<script lang="ts" setup>
import PlaylistsView from '@/components/PlaylistsView.vue'
import PlaylistView from '@/components/PlaylistView.vue'
import {useAppStore} from "~/stores/app";
const pv = ref()
const appStore = useAppStore()
const tracks = {}


const startSpotifyAuth = () => {
  const authUrl = useSpotifyAuthURL()
  window.location.href = authUrl
}
</script>

<template>
  <div id="app">
    <template v-if="appStore.spotifyUser && appStore.spotifyAccessToken">
      <div :class="{ showPlaylist: appStore.showPlaylist }" class="container">
        <PlaylistView :showing-playlist="appStore.showPlaylist" :tracks="tracks"/>
        <PlaylistsView ref="pv"/>
      </div>
    </template>
    <template v-else>
      <button @click="startSpotifyAuth">Log in with Spotify</button>
    </template>
  </div>
</template>
