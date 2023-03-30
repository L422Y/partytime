import { defineStore } from "pinia"
import { ref } from "vue"
import { ISpotifyPlaylist, ISpotifyUser } from "~/types/spotify"

export const useAppStore = defineStore("appStore", () => {
  const showPlaylist = ref(false)
  const currentPlaylist = ref({})
  const playlists = ref({})
  const spotifyAuthCode = ref("")
  const spotifyUser: Ref<ISpotifyUser | undefined> = ref()
  const spotifyAccessToken = ref("")
  const spotifyRefreshToken = ref("")
  const isAuthenticated = ref(false)

  const setSpotifyUser = (user: ISpotifyUser) => {
    localStorage?.setItem("spotify_user", JSON.stringify(user))
    spotifyUser.value = user
  }

  const setCurrentPlaylist = (playlist: ISpotifyPlaylist) => {
    localStorage?.setItem("current_playlist", JSON.stringify(playlist))
    currentPlaylist.value = playlist
  }

  const setPlaylists = (items: ISpotifyPlaylist[]) => {
    localStorage?.setItem("playlists", JSON.stringify(items || []))
    playlists.value = items
  }

  const clearAuthCode = () => {
    spotifyAuthCode.value = ""
    localStorage?.removeItem("spotify_auth_code")
  }

  const clearAccessToken = () => {
    spotifyAccessToken.value = ""
    localStorage?.removeItem("spotify_access_token")
  }
  const useAccessAuthorizationResponse = async (response: {
    access_token: string
    token_type: string
    expires_in: number
    refresh_token: string
    scope: string
  }) => {
    if (response) {

      if (response.access_token) {
        localStorage?.setItem("spotify_access_token", response.access_token)
        spotifyAccessToken.value = response.access_token
      }

      if (response.refresh_token) {
        localStorage?.setItem("spotify_refresh_token", response.refresh_token)
        spotifyRefreshToken.value = response.refresh_token
      }

      localStorage?.setItem("spotify_refresh_expires", ( Date.now() + response.expires_in * 1000 ).toString())
      useAppStore().$state.isAuthenticated = true

    }
  }

  return {
    spotifyUser,
    showPlaylist,
    spotifyAuthCode,
    spotifyAccessToken,
    spotifyRefreshToken,
    currentPlaylist,
    playlists,
    isAuthenticated,
    clearAuthCode,
    clearAccessToken,
    setCurrentPlaylist,
    setPlaylists,
    setSpotifyUser,
    useAccessAuthorizationResponse
  }
})
