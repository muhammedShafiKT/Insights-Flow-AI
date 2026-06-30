import {createClient} from "redis"
export const redis = createClient({
    url : process.env.REDIS_URL
})

redis.on("connect",()=>{
    console.log("Redis Connected")
})


redis.on("error",(error)=>{
    console.error("Redis error",error)
})

export async function redisConnect(){
    if(!redis.isOpen){
        await redis.connect()
    }
}