import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config()

const MONGO_URI = process.env.MONGO_URI

console.log(' process.env.MONGO_URI:', process.env.MONGO_URI)

export const connectDB = async () => {
  mongoose.set('strictQuery', true)

  try {
    const conn = await mongoose.connect(MONGO_URI)

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
