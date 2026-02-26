import { MongoServerClosedError } from "mongodb"
import mongoose from "mongoose"
import { cache } from "react";
const MONGODB_URI = process.env.MONGODB_URI as string

if(!MONGODB_URI){
    throw new Error("Please define MONGODB_URI")
}

interface mongooseCache {
    conn : typeof mongoose | null ;
    promise : Promise<typeof mongoose> | null
}

declare global {
    var mongoose : mongooseCache | null
}

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {conn : null , promise : null}
}

export async function connectDB(){
    if(cached!.conn) return cached!.conn

    if(!cached!.promise){
        cached!.promise = mongoose.connect(MONGODB_URI)
    }

    cached!.conn = await cached!.promise
    console.log("✅ server connected to MongoDB successfully!")
    return cached!.conn
}


