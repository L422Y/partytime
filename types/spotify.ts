export interface ISpotifyUser {
  country: string
  display_name: string
  email: string
  external_urls: {
    spotify: string
  }
  followers: {
    href: null
    total: number
  }
  href: string
  id: string
  images: ISpotifyImage[]
  product?: string
  type: string
  uri: string
}

export interface ISpotifyImage {
  height: number
  url: string
  width: number
}

export interface ISpotifyPlaylistOwner extends ISpotifyUser {
  display_name: string
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  type: string
  uri: string
}

export interface ISpotifyPlaylist {
  collaborative: boolean
  description: string
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  images: ISpotifyImage[]
  name: string
  owner: ISpotifyPlaylistOwner
  primary_color: null
  public: boolean
  snapshot_id: string
  tracks: {
    href: string
    total: number
  }
  type: string
  uri: string
}

export interface ISpotifyArtist {
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  name: string
  type: string
  uri: string
}

export interface ISpotifyPlaylistTrack {
  added_at: string
  added_by: {
    external_urls: {
      spotify: string
    }
    href: string
    id: string
    type: string
    uri: string
  }
  is_local: boolean
  primary_color: null
  track: {
    album: ISpotifyAlbum,
    artists: ISpotifyArtist[]
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids: {
      isrc: string
    }
    external_urls: {
      spotify: string
    }
    href: string
    id: string
    is_local: boolean
    name: string
    popularity: number
    preview_url: string
    track_number: number
    type: string
    uri: string
  }
  video_thumbnail: {
    url: null
  }
}

export interface ISpotifyUser {
  country: string
  display_name: string
  email: string
  external_urls: {
    spotify: string
  }
  followers: {
    href: null
    total: number
  }
  href: string
  id: string
  images: ISpotifyImage[]
  product?: string
  type: string
  uri: string
}

export interface ISpotifyImage {
  height: number
  url: string
  width: number
}

export interface ISpotifyPlaylistOwner {
  display_name: string
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  type: string
  uri: string
}

export interface ISpotifyPlaylistTrack {
  added_at: string
  added_by: {
    external_urls: {
      spotify: string
    }
    href: string
    id: string
    type: string
    uri: string
  }
  is_local: boolean
  primary_color: null
  track: ISpotifyTrack
  video_thumbnail: {
    url: null
  }
}

export interface ISpotifyTrack {
  album: ISpotifyAlbum,
  artists: ISpotifyArtist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: {
    isrc: string
  }
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
}


export interface ISpotifyAlbum {
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
  "genres": string[],
  "label": string,
  "popularity": number,
  "album_group": string,
  "artists": ISpotifyArtist[]
}

export interface ISpotifyPlayerState {
  id: string;
  is_active: boolean,
  is_private_session: boolean,
  is_restricted: boolean,
  name: string,
  type: string,
  volume_percent: number
}

export interface ISpotifyPlayerItem {
  "album": ISpotifyAlbum,
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

export interface ISpotifyQueue {
  "currently_playing": ISpotifyTrack,
  "queue": ISpotifyTrack[]
}

