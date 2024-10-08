const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const Blog = require('./models/blog')

require('dotenv').config()

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI)
    logger.info('connected to MongoBD')
  } catch (error) {
    logger.error('error connecting to MongoDB', error.message)
  }
}

connectToDatabase()

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})