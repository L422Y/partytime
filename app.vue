<template>
  <NuxtLayout/>
</template>
<script lang="ts" setup>
import { useAppStore } from "~/stores/app"

const appStore = useAppStore()

</script>
<script lang="ts">
if (process.client) {
  const lsPlaylist = localStorage?.getItem("current_playlist")
  const lsPlaylists = localStorage?.getItem("playlists")
  const lsUser = localStorage?.getItem("spotify_user")

  appStore.$state.playlists = lsPlaylists && lsPlaylists != "undefined" ? JSON.parse(lsPlaylists) : {}
  appStore.$state.currentPlaylist = lsPlaylist && lsPlaylist != "undefined" ? JSON.parse(lsPlaylist) : {}
  appStore.$state.spotifyUser = lsUser && lsUser != "undefined" ? JSON.parse(lsUser) : {}
  appStore.$state.spotifyAccessToken = localStorage?.getItem("spotify_access_token") || ""
  appStore.$state.spotifyRefreshToken = localStorage?.getItem("spotify_refresh_token") || ""
}
</script>
