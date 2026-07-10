import { Server } from "socket.io"
import { createAdapter } from "@socket.io/redis-adapter"
import { redis } from "./redis.js"
import jwt from "jsonwebtoken"
import { parseCookie } from "cookie"

let io

export const initsocket = async (httpServer) => {
    let pubClient = redis.duplicate()
    let subClient = redis.duplicate()

    await pubClient.connect()
    await subClient.connect()

    console.log(
        "[socket adapter] pub connected?", pubClient.isOpen,
        "sub connected?", subClient.isOpen
    )

    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true
        },
        adapter: createAdapter(pubClient, subClient)
    })

    io.use((socket, next) => {
        try {
            const rawCookie = socket.handshake.headers.cookie
            if (!rawCookie) return next(new Error("unauthorized: no cookie header"))

            const parsed = parseCookie(rawCookie)
            const token = parsed.accesstoken
            if (!token) return next(new Error("unauthorized: no accesstoken cookie"))

            const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            socket.userId = payload.userId ?? payload.id ?? payload._id
            console.log("SOCKET joined room:", `user:${socket.userId}`)
            next()
        } catch (error) {
            console.log("SOCKET AUTH FAILED:", error.name, "-", error.message)
            next(new Error("unauthorized"))
        }
    })

    io.on("connection", (socket) => {
        socket.join(`user:${socket.userId}`)
        console.log(`socket connected : ${socket.id}, (user ${socket.userId})`)

        socket.on("disconnect", () => {
            console.log(`socket disconnected :${socket.id}`)
        })
    })

    return io
}

export const getIO = () => {
    if (!io) throw new Error("socket i/o isnot initialized yet")
    return io
}