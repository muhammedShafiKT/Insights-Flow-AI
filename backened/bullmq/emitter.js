import { Emitter } from "@socket.io/redis-emitter";
import {redis} from "../config/redis.js"

export const emitter = new Emitter(redis)
// emitter.js
console.log("[emitter] redis options:", redis.options?.host, redis.options?.port, redis.options?.db);