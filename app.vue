<template>
  <NuxtLayout/>
</template>
<script lang="ts" setup>
import {useAppStore} from "~/stores/app"
import {usePlayerStore} from "~/stores/player"
import {useSpotifyGetPlaylists, useSpotifyGetUser} from "~/composables/useSpotify"

const appStore = useAppStore()
const player = usePlayerStore()

if (process.client) {
  const lsPlaylist = localStorage?.getItem("current_playlist")
  const lsPlaylists = localStorage?.getItem("playlists")
  const lsUser = localStorage?.getItem("spotify_user")


  appStore.$state.playlists = lsPlaylists && lsPlaylists != "undefined" ? JSON.parse(lsPlaylists) : {}
  appStore.$state.currentPlaylist = lsPlaylist && lsPlaylist != "undefined" ? JSON.parse(lsPlaylist) : {}
  appStore.$state.spotifyUser = lsUser && lsUser != "undefined" ? JSON.parse(lsUser) : {}
  appStore.$state.spotifyAccessToken = localStorage?.getItem("spotify_access_token") || ""
  appStore.$state.spotifyRefreshToken = localStorage?.getItem("spotify_refresh_token") || ""

  const playlistsCheck = (value: any) => {
    {
      if (value?.items?.length === 0) {
        useRouter().push("/now-playing")
      }
    }
  }
  const playlists = computed(() => appStore.$state.playlists)
  watch(playlists, (value) => playlistsCheck)
  playlistsCheck(appStore.playlists)

  let refreshInterval: any = null
  // @ts-ignore
  useNuxtApp().hook("spotify:authenticated",
    async (isAuthenticated: boolean) => {
      if (isAuthenticated) {
        setTimeout(async () => {
          await useSpotifyGetUser()
          await useSpotifyGetPlaylists()
          player.refreshPlayer()
          playlistsCheck(appStore.playlists)
          refreshInterval = setInterval(async () => {
            await player.refreshPlayer()
          }, 10000)
        }, 0)
      } else {
        clearInterval(refreshInterval)
      }
    })
  await useSpotifyAuthRefresh()
}
</script>
