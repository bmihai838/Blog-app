const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body

    let user = await User.findOne({})
    if (!user) {
        user = new User({
            username: 'defaultUser',
            name: 'Default User',
            passwordHash: 'hashedPassword'
        })
        await user.save()
    }

    if(!body.title || !body.url) {
        return response.status(400).json({ error: 'title or url missing' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const id = request.params.id

    await Blog.findByIdAndDelete(id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    try{
        const { likes } = request.body

        const updatedBlog = await Blog.findByIdAndUpdate(
            request.params.id,
            { likes },
            {new: true, runValidators: true, context: 'query' }
        )

        if (updatedBlog) {
            response.json(updatedBlog)
        } else {
            response.status(404).end()
        } 
    }   catch (error) {
        next(error)
    }
})

module.exports = blogsRouter