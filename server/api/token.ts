import {useRequestBody} from "nitropack/dist/runtime/utils";
import {Buffer} from "unenv/runtime/node/buffer";

export default defineEventHandler(async (event) => {
    const {spotifyClientId, spotifyRedirectURL} = useRuntimeConfig().public
    const {spotifyClientSecret} = useRuntimeConfig()
    if (spotifyClientId && spotifyClientSecret && spotifyRedirectURL) {
        const tokenUrl = `https://accounts.spotify.com/api/token`
        const body = await readBody(event)
        const requestBody = new URLSearchParams({
            grant_type: body?.grant_type || 'authorization_code',
            refresh_token: body?.refresh_token,
            code: body?.code,
            redirect_uri: spotifyRedirectURL,
        })

        const base64Credentials = btoa(`${spotifyClientId}:${spotifyClientSecret}`);

        const apiResponse = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${base64Credentials}`,
            },
            body: requestBody,
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                const data = await response.json();
                return data
            })
            .catch((error) => {
                return {error: error.message};
            });


        console.log(apiResponse)
        return {...apiResponse, req: {...requestBody}}

    }
})