import { useAppStore } from "@/stores/app"
import { useSpotifyGetUser } from "~/composables/useSpotify"
import { Ref } from "vue"

const useSpotifyAuthResponse = async (response: any) => {
  const appStore = useAppStore()
  if (response?.data?.error) {
    switch (response?.data?.error) {
      case "invalid_grant":
        // The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.
        appStore.clearAuthCode()
        useAppStore().$state.isAuthenticated = false

        break
      case "invalid_client":
        // Client authentication failed (e.g., unknown client, no client authentication included, or unsupported authentication method).
        useAppStore().$state.isAuthenticated = false
        break
      case "invalid_request":
        // The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.
        break
      case "unauthorized_client":
        // The authenticated client is not authorized to use this authorization grant type.
        useAppStore().$state.isAuthenticated = false
        break
      default:
      // Handle any other errors
    }
  } else {
    // Handle the response from your server
    await appStore.useAccessAuthorizationResponse(response)
  }
}
export const useSpotifyAuthGetAccessToken = async (authorizationCode: string) => {
  const appStore = useAppStore()
  if (authorizationCode) {
    const response = await $fetch("/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: authorizationCode,
      }),
    })
    await useSpotifyAuthResponse(response)
  } else {
    // Handle errors, e.g. show an error message or redirect to an error page
    console.error("Error during authentication:", authorizationCode)
  }
}

const authRefreshed: Ref<boolean> = ref(false)
export const useSpotifyAuthRefresh = async () => {
  if (authRefreshed.value) {
    console.warn("Already refreshing auth")
    return
  }
  authRefreshed.value = true
  setTimeout(() => {
    authRefreshed.value = false
  }, 1000 * 60 * 5)
  const appStore = useAppStore()
  appStore.clearAccessToken()
  if (appStore.spotifyRefreshToken) {
    await fetch("/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: appStore.spotifyRefreshToken,
        grant_type: "refresh_token",
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          useAppStore().$state.isAuthenticated = false
          throw new Error(`HTTP error ${response.status}`)
        }
        await useSpotifyAuthResponse(await response.json())
      })
      .catch((error) => {
        console.error("ERROR: ", error.message)
      })

  }
}

export const useSpotifyAuthURL = () => {
  const {spotifyClientId, spotifyCallbackUrl} = useRuntimeConfig().public
  const scopes = "user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state"
  return `https://accounts.spotify.com/authorize?` +
    `client_id=${spotifyClientId}` +
    `&response_type=code` +
    `&redirect_uri=${spotifyCallbackUrl}` +
    `&scope=${scopes}`
}

