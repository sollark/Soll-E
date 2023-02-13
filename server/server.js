import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'

import { connectDB } from './mongodb/connect.js'
import { postRoutes } from './routes/postRoutes.js'
import { solleRoutes } from './routes/solleRoutes.js'

const PORT = process.env.PORT || 3030

dotenv.config()

const app = express()

app.use(express.json({ limit: '50mb' }))
app.use('/api/post', postRoutes)
app.use('/api/solle', solleRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'public')))
} else {
  const corsOptions = {
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
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
