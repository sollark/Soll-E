import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'

import { connectDB } from './mongodb/connect.js'
import { postRoutes } from './routes/postRoutes.js'
import { solleRoutes } from './routes/solleRoutes.js'

const PORT = process.env.PORT || 5500

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use('/api/posts', postRoutes)
app.use('/api/solle', solleRoutes)

app.get('/', async (req, res) => {
  res.send('Hello World!')
})

const startServer = async () => {
  try {
    await connectDB()
  } catch (err) {
    console.error(err)
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()
