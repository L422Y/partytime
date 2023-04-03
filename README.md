# Partytime 🥳

A social music app that allows users to pick and listen to music together, launch the app and put it on a TV or computer screen to let people see what's playing, what's next, and even vote using SMS!

Once you've set up your Spotify app, you can run the app locally by running `npm run dev` and navigating to [http://localhost:5173/](http://localhost:5173/)

If everything is set up correctly, you should be able to log in with your Spotify account and see the app. If you're playing something on that account, it should show up in the app.

Click the "Now Playing" area at the bottom to open a full screen "Now Playing" view.


## Spotify Setup

1) Create a Spotify Developer account and register an app to get a `CLIENT_ID` and `CLIENT_SECRET`
2) Add your redirect URI to your app settings. The redirect URI should be the URL you're using for your app,
   plus `/callback` (e.g. `https://partyharty.vercel.app/callback` or `http://localhost:1234`).
3) Create a `.env` file at the root of the project with the following contents:

```dotenv
# Redirect URL for Spotify authentication flow
NUXT_PUBLIC_SPOTIFY_REDIRECT_URL="http://localhost:5173/"

# Callback URL for Spotify authentication flow
NUXT_PUBLIC_SPOTIFY_CALLBACK_URL="http://localhost:5173/spotify-callback"

# Spotify Client ID
NUXT_PUBLIC_SPOTIFY_CLIENT_ID="YOUR_SPOTIFY_CLIENT_ID"

# Spotify Client Secret
NUXT_SPOTIFY_CLIENT_SECRET="YOUR_SPOTIFY_CLIENT_SECRET"
```


## Voting Setup (Optional)

Voting is still a work in progress, and doesn't serve much purpose at the moment as the Spotify API currently does not
allow us to modify the queue, but if you want to play with it, here's what you'll need:

1) A [Twilio](https://www.twilio.com/) account and phone number with SMS capabilities
2) A running instance of [partytime-server](https://github.com/l422y/partytime-server)
3) A public URL set up for your [Twilio SMS webhook](https://www.twilio.com/docs/usage/webhooks/sms-webhooks). If you're using a local development environment, you can use a service
   like [ngrok](https://ngrok.com/) to create a public URL for your [partytime-server](https://github.com/l422y/partytime-server) instance that is running on your machine.

```dotenv
# Twilio Account SID and Spotify Account Email, used for voting
NUXT_NUMBER_MAP='{"+12125551212": "spotifyuser@gmail.com", "+12127654321": "anotheraccount@spotifyuser.com"}'

# partytime-server endpoint
NUXT_PUBLIC_WEBSOCKET_SERVER_ENDPOINT="ws://localhost:4246"
```


## Installation

```bash

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
