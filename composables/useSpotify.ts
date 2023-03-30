import { useAppStore } from "@/stores/app"
import { useSpotifyAuthRefresh } from "@/composables/useSpotifyAuth"

export const useSpotifyAPI = async (path: any, params: { [key: string]: string }, retry: boolean = true) => {
  const appStore = useAppStore()
  const url = new URL(`https://api.spotify.com/v1${path}`)
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value))

  return await useFetch(url.toString(), {
    method: "GET",
    headers: {Authorization: `Bearer ${appStore.spotifyAccessToken}`},
  }).then(async (response) => {
    const {error} = response
    if (error?.value && error.value.statusCode === 401)
      console.error("ERROR: ", error.value.message)
    if (retry) {
      if (error.value?.statusCode === 401) {
        await useSpotifyAuthRefresh()
        await useSpotifyAPI(path, params, false)
      }
    }
    return response
  }).catch((error) => {
    console.error("ERROR: ", error.message)
    return {error: error.message, data: ref(), pending: ref()}
  })
}
export const useSpotifyGetUser = async (userId?: string) => {
  const appStore = useAppStore()
  const response = await useSpotifyAPI(userId ? `/users/${userId}` : "/me", {})
  if (response?.data?.value) {
    appStore.setSpotifyUser(response.data.value.user)
    await useSpotifyGetPlaylists()
  }
}

export const useSpotifyGetPlaylists = async () => {
  const appStore = useAppStore()
  if (!( appStore.spotifyAccessToken && appStore.spotifyUser )) {
    console.log("no access token or user")
    await useSpotifyAuthRefresh()
  }
  if (appStore.spotifyUser?.id) {
    return useSpotifyAPI(`/users/${appStore.spotifyUser.id}/playlists`,
      {
        limit: "50",
        offset: "0"
      }).then((response) => {
      if (response) {
        appStore.setPlaylists(response.data.value)
        return response
      }
    })
  } else {
    return {error: "no user id", data: ref(), pending: ref()}
  }

}
export const useSpotifyGetPlaylist = async (playlistId: string) => {
  const appStore = useAppStore()
  if (await useSpotifyAuthCheck()) {
    return useSpotifyAPI(`/playlists/${playlistId}`, {}).then((response) => {
      if (response) {
        appStore.setCurrentPlaylist(response?.data?.value)
        return response
      }
    })
  }
}

export const useSpotifyAuthCheck = async () => {
  const appStore = useAppStore()
  if (process.client) {
    if (!( appStore.spotifyAccessToken && appStore.spotifyUser )) {
      await useSpotifyAuthRefresh()
      if (appStore.spotifyAccessToken) {
        return true
      }
    } else {
      return true
    }
  }
}
