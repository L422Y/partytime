import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useAppStore = defineStore('appStore', () => {
    const showPlaylist = ref(false)
    const currentPlaylist = ref({})
    const playlists = ref({})
    const spotifyAuthCode = ref('')
    const spotifyUser = ref({})
    const spotifyAccessToken = ref('')
    const spotifyRefreshToken = ref('')

    if (process?.client) {
        const lsPlaylist = localStorage?.getItem('current_playlist')
        const lsUser = localStorage?.getItem('spotify_user')
        playlists.value = lsPlaylist && lsPlaylist != 'undefined' ? JSON.parse(lsPlaylist) : {}
        spotifyUser.value = lsUser && lsUser != 'undefined' ? JSON.parse(lsUser) : {}
        spotifyAccessToken.value = localStorage?.getItem('spotify_access_token') || ""
        spotifyRefreshToken.value = localStorage?.getItem('spotify_refresh_token') || ""
    }

    const setSpotifyUser = (user) => {
        localStorage?.setItem('spotify_user', JSON.stringify(user))
        spotifyUser.value = user
    }

    const setCurrentPlaylist = (playlist) => {
        localStorage?.setItem('current_playlist', JSON.stringify(playlist))
        currentPlaylist.value = playlist
    }

    const setPlaylists = (playlists) => {
        localStorage?.setItem('playlists', JSON.stringify(playlists || []))
        currentPlaylist.value = playlists
    }

    const clearAuthCode = () => {
        spotifyAuthCode.value = ''
        localStorage?.removeItem('spotify_auth_code')
    }

    const clearAccessToken = () => {
        spotifyAccessToken.value = ''
        localStorage?.removeItem('spotify_access_token')
    }
    const useAccessAuthorizationResponse = (response: {
        access_token: string
        token_type: string
        expires_in: number
        refresh_token: string
        scope: string
    }) => {
        if (response) {
            console.log('useAccessAuthorizationResponse', response)
            if (response.access_token) {
                localStorage?.setItem('spotify_access_token', response.access_token)
            }
            if (response.refresh_token) {
                localStorage?.setItem('spotify_refresh_token', response.refresh_token)
            }
            localStorage?.setItem(
                'spotify_refresh_expires',
                (Date.now() + response.expires_in * 1000).toString()
            )

            spotifyAccessToken.value = response.access_token
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
        clearAuthCode,
        clearAccessToken,
        setCurrentPlaylist,
        setPlaylists,
        setSpotifyUser,
        useAccessAuthorizationResponse
    }
})
