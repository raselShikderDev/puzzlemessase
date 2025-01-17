import mongoose from "mongoose"

type ConnectionObject = {
    isConnected? : number
}

const connection:ConnectionObject = {}

 async function dbConnect(): Promise<void>{
    try {
       if (connection.isConnected) {
        console.log("Database already Connected")
        return
       } 
       const db = await mongoose.connect(process.env.MONGO_URI || '')
       connection.isConnected = db.connections[0].readyState
       console.log(connection.isConnected)
       console.log("Database Connected Successfully")
    } catch (error) {
        console.error(`Database Connection faild: ${error}`)
        process.exit(1)
    }
 }

 export default dbConnect