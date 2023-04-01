import { io, Socket } from "socket.io-client"

const numberMap: { [key: string]: string } = JSON.parse(process.env.NUXT_NUMBER_MAP || "{}")

export interface ITwilioMessage {
  ToCountry: string,
  ToState: string,
  SmsMessageSid: string,
  NumMedia: string,
  ToCity: string,
  FromZip: string,
  SmsSid: string,
  FromState: string,
  SmsStatus: string,
  FromCity: string,
  Body: string,
  FromCountry: string,
  To: string,
  MessagingServiceSid: string,
  ToZip: string,
  NumSegments: string,
  MessageSid: string,
  AccountSid: string,
  From: string,
  ApiVersion: string
}

const votes: { [key: string]: { [key: string]: number } } = {}


const sockets: { [key: string]: Socket } = {}

for (const number in numberMap) {
  const accountEmail = numberMap[number]
  const socket = io("http://localhost:5174",
    // path: numberMap[number]
    {
      path: `/${accountEmail}/`,
      transports: ["websocket"]
    }
  )
  socket.on("connect", () => {
    console.log("SMS relay socket connected")
  })

  socket.on("connect_error", () => {
    console.log("SMS relay socket disconnected, reconnecting in 1 second...")
    setTimeout(() => {
      socket.connect()
    }, 1000)
  })

  sockets[accountEmail] = socket
}


export default defineEventHandler(async (event) => {
  const body: ITwilioMessage = await readBody(event)
  const accountEmail = numberMap[body.To]
  const socket = sockets[accountEmail]
  const command = body.Body.trim().toLowerCase()
  const numCommand = parseInt(command)
  const response = "Invalid command... try ? for help"

  switch (true) {
    case ( command === "?" ):
      break
    case ( Number.isInteger(numCommand) && numCommand > 0 && numCommand < 11 ):
      setVote(accountEmail, body.From, numCommand)
      break
    default:
      break
  }


  setResponseStatus(202)
  setHeader(event, "Content-Type", "text/xml")
  return `<Response><Message>${response}</Message></Response>`
})

const setVote = (accountEmail: string, from: string, vote: number) => {
  const socket = sockets[accountEmail]
  if (!votes[accountEmail]) votes[accountEmail] = {}
  votes[accountEmail][from] = vote

  if (socket && socket?.connected) {
    socket.emit("vote", {uid: from, body: vote})
    socket.emit("votes", {votes: votes[accountEmail]})
  }
}
