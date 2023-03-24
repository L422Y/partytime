import {useAppStore} from '@/stores/app'

const useAuthResponse = async (response: any) => {
    const appStore = useAppStore()
    if (response.data?.error) {
        switch (response.data.error) {
            case 'invalid_grant':
                // The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.
                appStore.clearAuthCode()
                break
            case 'invalid_client':
                // Client authentication failed (e.g., unknown client, no client authentication included, or unsupported authentication method).
                break
            case 'invalid_request':
                // The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.
                break
            case 'unauthorized_client':
                // The authenticated client is not authorized to use this authorization grant type.
                break
            default:
            // Handle any other errors
        }
    } else {
        // Handle the response from your server
        appStore.useAccessAuthorizationResponse(response)
        await useGetSpotifyUser()
    }
}
export const useGetAccessToken = async (authorizationCode: string) => {
    console.log('GET ACCESS TOKEN', {authorizationCode})
    const appStore = useAppStore()
    if (authorizationCode) {
        const response = await fetch('/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: authorizationCode,
            }),
        })
        console.log({response})
        await useAuthResponse(response);
    } else {
        // Handle errors, e.g. show an error message or redirect to an error page
        console.error('Error during authentication:', authorizationCode)
    }
}

export const useGetSpotifyUser = async (userId?: string) => {
    const appStore = useAppStore()
    await useSpotifyAPI('/me', {}).then((oData) => {
        console.log({useGetSpotifyUser: oData.data})
        appStore.setSpotifyUser(oData.data)
    })
}

export const useSpotifyAPI = (path, data) => {
    const appStore = useAppStore()
    const url = new URL(`https://api.spotify.com/v1${path}`);
    Object.entries(data).forEach(([key, value]) => url.searchParams.append(key, value));

    return fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${appStore.spotifyAccessToken}`,
        },
    })

}
export const useSpotifyAuthRefresh = async () => {
    const appStore = useAppStore()
    appStore.clearAccessToken()
    if (appStore.spotifyRefreshToken) {
        await fetch('/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh_token: appStore.spotifyRefreshToken,
                grant_type: 'refresh_token',
            }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                await useAuthResponse(response.json());
            })
            .catch((error) => {
                console.error('ERROR: ', error.message);
            });

    }
}

export const useSpotifyAuthURL = () => {
    console.log(useRuntimeConfig())
    const {spotifyClientId, spotifyCallbackURL} = useRuntimeConfig().public
    const scopes = 'user-read-private user-read-email'
    console.log({spotifyClientId, spotifyCallbackURL})
    const authUrl =
        `https://accounts.spotify.com/authorize?` +
        `client_id=${spotifyClientId}` +
        `&response_type=code` +
        `&redirect_uri=${spotifyCallbackURL}` +
        `&scope=${scopes}`

    console.log(authUrl)
    // const left = (window.screen.width / 2) - (500 / 2)
    // const top = (window.screen.height / 2) - (780 / 2)
    // window.open(, '_blank', `width=500,height=780,left=${ left },top=${ top }`)
    return authUrl
}

export const useSpotifyPlaylistRefresher = async () => {
    const appStore = useAppStore()
    if (appStore.spotifyAccessToken && appStore.spotifyUser) {
        await useSpotifyAPI(`/users/${appStore.spotifyUser.id}/playlists`, {
            limit: 50,
            offset: 0
        }).then((oData: any) => {
            console.log(oData.data)
            appStore.setPlaylists(oData.data)
        })
    }
}
