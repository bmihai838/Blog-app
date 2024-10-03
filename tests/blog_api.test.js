const { test, beforeEach, after, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')
const { initialBlogs, blogsInDb } = require('../utils/list_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

const createNewBlog = (overrides = {}) => ({
    title: "Test Blog",
    author: "Test Author",
    url: "http://testblog.com",
    likes: 0,
    ...overrides
})


describe('when there are initially some blogs saved', () => {
    
    
    test('blogs are returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, initialBlogs.length)
    })

    test('unique identifier is named id', async () => {
        const response = await api.get('/api/blogs')
        const blog = response.body[0]
        assert(blog.id, 'blog has id property')
        assert(!blog._id, 'blog doesn not have _id property')
    })
})

describe('addition of a new blog', () => {
    test('succes with valid data', async () => {
        const newBlog = createNewBlog()
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await blogsInDb()
        assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)
    
        const contents = blogsAtEnd.map(n => n.title)
        assert(contents.includes('Test Blog'))
    })
    
    test('if like property is missng, it defaults to 0', async () => {
        const newBlog = createNewBlog({ likes: undefined })
    
        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        assert.strictEqual(response.body.likes, 0)
        const savedBlogId = response.body.id
        const savedBlog = await Blog.findById(savedBlogId)
        assert.strictEqual(savedBlog.likes, 0)
    })
    
    test('fails with status code 400 if title is missing', async () => {
        const newBlog = createNewBlog({ title: undefined })
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    
        const blogsAtEnd = await blogsInDb()
        assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
    })
    
    test('fails with status code 400 if url is missing', async () => {
        const newBlog = createNewBlog({ url: undefined })
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    
        const blogsAtEnd = await blogsInDb()
        assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
    })
})

test('deletion of a blog', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await blogsInDb()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

test('a blog ca be updated', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

    const blogsAtEnd = await blogsInDb()
    const found = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(found.likes, blogToUpdate.likes + 1)
})

after(async () => {
    await mongoose.connection.close()
})