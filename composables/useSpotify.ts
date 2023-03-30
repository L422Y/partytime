import { useAppStore } from "@/stores/app"
import { useSpotifyAuthRefresh } from "@/composables/useSpotifyAuth"

export const useSpotifyAPI = async (path: any, params: { [key: string]: string } = {}, retry: boolean = true) => {
  const appStore = useAppStore()
  const url = new URL(`https://api.spotify.com/v1${path}`)
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value))

  if (appStore.$state.spotifyAccessToken === null) {
    return
  }
  return useFetch(url.toString(), {
    method: "GET",
    // headers: {
    //   "Authorization": "Basic " + btoa(client_id + ":" + client_secret)
    // },
    headers: {Authorization: `Bearer ${appStore.$state.spotifyAccessToken}`},
  }).then(async (response) => {
    const {error} = response
    if (error?.value && error.value.statusCode === 401) {
      useAppStore().$state.isAuthenticated = false

      if (retry) {
        useAppStore().$state.isAuthenticated = false
        await useSpotifyAuthRefresh()
        await useSpotifyAPI(path, params, false)
      }
    }
    useAppStore().$state.isAuthenticated = true

    return response
  }).catch((response) => {
    console.error("ERROR: ", response)
    return response
  })
}
export const useSpotifyGetUser = async (userId?: string) => {
  const appStore = useAppStore()
  const response = await useSpotifyAPI(userId ? `/users/${userId}` : "/me", {}).then(
    async (response) => {
      if (response) {
        useAppStore().$state.isAuthenticated = true

        appStore.setSpotifyUser(response.data.value)
        return response
      }
    })
}

export const useSpotifyGetPlaylists = async () => {
  const appStore = useAppStore()
  if (!( appStore.$state.spotifyAccessToken && appStore.$state.spotifyUser )) {
    console.log("no access token or user", appStore.$state)
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
