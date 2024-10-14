const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
    const blogResult = await Blog.deleteMany({})
    const userResult = await User.deleteMany({})
    console.log(`Deleted ${blogResult.deletedCount} blogs and ${userResult.deletedCount} users`)

    response.status(204).end()
})

module.exports = router