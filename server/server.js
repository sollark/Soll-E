import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

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
  app.use(express.static(path.resolve(getDirname(import.meta.url), 'public')))
} else {
  const corsOptions = {
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

app.get('/**', (req, res) => {
  console.log('import.meta.url:', import.meta.url)
  res.sendFile(path.join(getDirname(import.meta.url), 'public', 'index.html'))
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

function getFilename(metaUrl) {
  const __filename = fileURLToPath(metaUrl)

  return __filename
}

function getDirname(metaUrl) {
  const __dirname = path.dirname(getFilename(metaUrl))

  return __dirname
}
