// import { io } from "socket.io-client"
import { useAppStore } from "~/stores/app"
// import { computed } from "vue"
//
import { io, Socket } from "socket.io-client"
import { computed } from "vue"
import { useVotesStore } from "~/stores/votes"
import { usePlayerStore } from "~/stores/player"

export default defineNuxtPlugin((nuxtApp) => {
  const appStore = useAppStore()
  const votesStore = useVotesStore()
  const playerStore = usePlayerStore()

  let socket: Socket
  const spotifyUser = computed(() => appStore.spotifyUser)
  console.log("Websocket Plugin Loaded")

  watch(votesStore, (value) => {
    if (socket) {
      socket.emit("votes", value.votes.value)
    }
  })

  watch(spotifyUser, (value) => {
    if (!socket && spotifyUser?.value?.email) {
      socket = io("http://localhost:5174", {
        transports: ["websocket"],
        path: `/${spotifyUser.value.email}/`,
      })
      socket.on("connect", () => {
        console.log("WebSocket Connected", socket.id)
      })
      socket.on("connect_error", () => {
        console.log("WebSocket Disconnected, reconnecting in 1 second...")
        setTimeout(() => {
          socket.connect()
        }, 1000)
      })
      socket.on("message", (data: any) => {
        console.log("message received: %s", data)
        socket.emit("message", {data})
      })
      socket.on("smsNumber", ({data}) => {
        console.log("smsNumber", data)
        if (data) {
          appStore.$state.smsNumber = data
        }
      })
    }
  })
})
