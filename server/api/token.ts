export default defineEventHandler(async (event) => {
  const {spotifyClientId, spotifyCallbackUrl} = useRuntimeConfig().public
  const spotifyClientSecret = process.env.NUXT_SPOTIFY_CLIENT_SECRET

  if (spotifyClientId && spotifyClientSecret && spotifyCallbackUrl) {
    const tokenUrl = `https://accounts.spotify.com/api/token`
    const body = await readBody(event)
    const requestBody: {
      code: any;
      grant_type: any;
      redirect_uri: any;
      client_secret: any;
      client_id: any;
      refresh_token?: any;
    } = {
      grant_type: body?.grant_type || "authorization_code",
      code: body?.code,
      redirect_uri: spotifyCallbackUrl,
      client_id: spotifyClientId,
      client_secret: spotifyClientSecret
    }

    if (body?.refresh_token) {
      requestBody.refresh_token = body?.refresh_token
    }

    const searchBody = new URLSearchParams(requestBody).toString()
    return await fetch(tokenUrl, {
      method: "POST",
      headers: {"Content-Type": "application/x-www-form-urlencoded",},
      body: searchBody
    }).then((response) => {
      return response.json()
    }).catch((error) => {
      return {error: error}
    })
  } else {
    return {
      error: "Missing spotify client id or secret",
      spotifyClientId, spotifyCallbackUrl
    }
  }

})
