import { Server } from "socket.io"

let started = false

export default defineNuxtPlugin(() => {
  const numberMap: { [key: string]: string } = JSON.parse(process.env.NUXT_NUMBER_MAP || "{}")
  const servers: { [key: string]: Server } = {}
  let storedVotes = {}
  if (started) return
  started = true

  for (const number in numberMap) {
    const socketServer = new Server(5174, {
        transports: ["websocket"],
        path: `/${numberMap[number]}/`
      }
    )
    socketServer.on("error", (err) => {
      console.log("Socket error", err)
    })

    socketServer.on("connection", (socket) => {
      console.log("Connection", socket.id)

      socket.on("message", function message(data: any) {
        console.log("message received: %s", data)
      })

      socket.on("newVote", function vote(data: any) {
        console.log("vote received: %s", data)
        socketServer.emit("vote", {data})
      })

      socket.on("votes", function votes(data: any) {
        console.log("votes received: %s", data)
        storedVotes = data
        socketServer.emit("votesUpdated", {data})
      })
    })

    socketServer.on("connect", (socket) => {
      socket.emit("message", `welcome ${socket.id}`)
      socket.emit("votesUpdated", {data: storedVotes})
      socket.emit("smsNumber", {data: number})
      socket.broadcast.emit("message", `${socket.id} joined`)
    })

    servers[number] = socketServer
  }
})
