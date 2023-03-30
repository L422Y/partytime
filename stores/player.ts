import { defineStore } from "pinia"
import { ref } from "vue"
import { useSpotifyAPI } from "#imports"

export interface IPlayerState {
  id: string;
  is_active: boolean,
  is_private_session: boolean,
  is_restricted: boolean,
  name: string,
  type: string,
  volume_percent: number
}
export interface IPlayerItem {
  "album": {
  "album_type": string,
    "total_tracks": number,
    "available_markets": string[],
    "external_urls": {
    "spotify": string
  },
  "href": string,
    "id": string,
    "images": [
    {
      "url": string,
      "height": number,
      "width": number
    }]

  "name": string,
    "release_date": string,
    "release_date_precision": string,
    "restrictions": {
    "reason": string
  },
  "type": string,
    "uri": string,
    "copyrights": [
    {
      "text": string,
      "type": string
    }
  ],
    "external_ids": {
    "isrc": string,
      "ean": string,
      "upc": string
  },
  "genres": ["Egg punk", "Noise rock"],
    "label": string,
    "popularity": 0,
    "album_group": "compilation",
    "artists": [
    {
      "external_urls": {
        "spotify": string
      },
      "href": string,
      "id": string,
      "name": string,
      "type": "artist",
      "uri": string
    }
  ]
},
  "artists": [
  {
    "external_urls": {
      "spotify": string
    },
    "followers": {
      "href": string,
      "total": 0
    },
    "genres": ["Prog rock", "Grunge"],
    "href": string,
    "id": string,
    "images": [
      {
        "url": "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
        "height": 300,
        "width": 300
      }
    ],
    "name": string,
    "popularity": 0,
    "type": "artist",
    "uri": string
  }
],
  "available_markets": [string],
  "disc_number": 0,
  "duration_ms": 0,
  "explicit": false,
  "external_ids": {
  "isrc": string,
    "ean": string,
    "upc": string
},
  "external_urls": {
  "spotify": string
},
  "href": string,
  "id": string,
  "is_playable": false,
  "linked_from": {},
  "restrictions": {
  "reason": string
},
  "name": string,
  "popularity": 0,
  "preview_url": string,
  "track_number": 0,
  "type": "track",
  "uri": string,
  "is_local": false
}

export const usePlayerStore = defineStore("playerStore", () => {
  const device: Ref<IPlayerState | undefined> = ref()
  const repeat_state: Ref<string | undefined> = ref()
  const shuffle_state: Ref<boolean | undefined> = ref()
  const context: Ref<{
    "type": string,
    "href": string,
    "external_urls": {
      "spotify": string
    },
    "uri": string
  } | undefined> = ref()
  const timestamp: Ref<number | undefined> = ref()
  const progress_ms: Ref<number | undefined> = ref()
  const is_playing: Ref<boolean | undefined> = ref()
  const item: Ref<IPlayerItem | undefined> = ref()

  const nowPlayingMinimized = ref(false)

  const setPlayer = (data: any) => {
    if (data === undefined) return
    device.value = data.device
    repeat_state.value = data.repeat_state
    shuffle_state.value = data.shuffle_state
    context.value = data.context
    timestamp.value = data.timestamp
    progress_ms.value = data.progress_ms
    is_playing.value = data.is_playing
    item.value = data.item
  }

  const refreshPlayer = () => {
    fetchPlayer().then((data) => setPlayer(data))
  }

  const fetchPlayer = async () => {
    return await useSpotifyAPI("/me/player")
      .then((response) => {
        const {error, pending, data} = response
        if (error.value) console.error(error.value)
        if (pending.value) console.log("pending")
        if (data.value) return data.value
        return data.value === "" ? {} : data.value
      }).then(setPlayer)
  }


  return {
    refreshPlayer,
    nowPlayingMinimized,
    device,
    repeat_state,
    shuffle_state,
    context,
    timestamp,
    progress_ms,
    is_playing,
    item
  }
})
