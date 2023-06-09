import { defineStore } from "pinia"
import { Ref, ref } from "vue"
import { useSpotifyAPI } from "#imports"
import { ISpotifyPlayerItem, ISpotifyPlayerState, ISpotifyQueue } from "~/types/spotify"

export const usePlayerStore = defineStore("playerStore", () => {
  const currentQueue: Ref<ISpotifyQueue | undefined> = ref()
  const device: Ref<ISpotifyPlayerState | undefined> = ref()
  const repeat_state: Ref<string | undefined> = ref()
  const shuffle_state: Ref<boolean | undefined> = ref()
  const context: Ref<{
    type: string,
    href: string,
    external_urls: { spotify: string },
    uri: string
  } | undefined> = ref()
  const timestamp: Ref<number | undefined> = ref()
  const progress_ms: Ref<number | undefined> = ref()
  const is_playing: Ref<boolean | undefined> = ref()
  const item: Ref<ISpotifyPlayerItem | undefined> = ref()

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
  //
  // const adjustQueue = async (adjustment: any) => {
  //   console.log("adjustQueue", currentQueue.value)
  //   const params = {
  //     uri: currentQueue.value?.queue[0].uri,
  //     position: "3"
  //   }
  //
  //   const {error, pending, data} = await useSpotifyAPI("/me/player/queue", params)
  //
  //   if (error.value) console.error(error.value)
  //   if (pending.value) console.log("pending")
  //   setQueue(data.value)
  //   console.log("adjustQueue", params, data.value)
  // }


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

  const fetchQueue = async (): Promise<ISpotifyQueue> => {
    return await useSpotifyAPI("/me/player/queue")
      .then((response) => {
        const {error, pending, data} = response
        if (error.value) console.error(error.value)
        if (pending.value) console.log("pending")
        if (data.value) return data.value
        return data.value === "" ? {} : data.value
      }).then((data: ISpotifyQueue) => {
        setQueue(data)
        return data
      })
  }

  const setQueue = (data: ISpotifyQueue) => {
    if (data === undefined) return
    data.queue = data.queue.map(({
                                   album,
                                   artists,
                                   duration_ms,
                                   explicit,
                                   external_ids,
                                   external_urls,
                                   href,
                                   id,
                                   name,
                                   popularity,
                                   preview_url,
                                   uri
                                 }) => ( {
                                  album: {
                                    id: album.id,
                                    uri: album.uri,
                                    name: album.name,
                                    images: album.images,
                                  },
                                  artists,
                                  duration_ms,
                                  explicit,
                                  external_ids,
                                  external_urls,
                                  href,
                                  id,
                                  name,
                                  popularity,
                                  preview_url,
                                  uri
    } ))
    currentQueue.value = data
  }

  const refreshQueue = async () => {
    await fetchQueue().then((data: ISpotifyQueue) => {
      setQueue(data)
    })
  }

  watch(item, async (value) => {
    await refreshQueue()
  })

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
    item,
    currentQueue
  }
})
