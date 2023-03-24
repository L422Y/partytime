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
    album: {
      album_type: string
      artists: ISpotifyArtist[]
      available_markets: string[]
      external_urls: {
        spotify: string
      }
      href: string
      id: string
      images: ISpotifyImage[]
      name: string
      release_date: string
      release_date_precision: string
      total_tracks: number
      type: string
      uri: string
    }
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
  track: {
    album: {
      album_type: string
      artists: ISpotifyArtist[]
      available_markets: string[]
      external_urls: {
        spotify: string
      }
      href: string
      id: string
      images: ISpotifyImage[]
      name: string
      release_date: string
      release_date_precision: string
      total_tracks: number
      type: string
      uri: string
    }
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
