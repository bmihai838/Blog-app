const blog = require("../models/blog")
const User = require('../models/user')

const initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5
    }
  ]

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    return blogs.reduce((favorite, current) => 
        current.likes > favorite.likes ? current : favorite
    )
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

    const likesByAuthor = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + blog.likes
        return acc
    }, {})

    return Object.entries(likesByAuthor).reduce((top, [author, likes]) => 
        likes > top.likes ? { author, likes } : top
    , { author: '', likes: 0})

}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const blogCounts = {}

    blogs.forEach(blog => {
        blogCounts[blog.author] = (blogCounts[blog.author] || 0) + 1
    })

        let maxAuthor = ''
        let maxBlogs = 0

        for (let author in blogCounts) {
            if (blogCounts[author] > maxBlogs) {
                maxAuthor = author
                maxBlogs = blogCounts[author]
            }
        } 
        return { author: maxAuthor, blogs: maxBlogs }
}

const blogsInDb = async () => {
    const blogs = await blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostLikes, mostBlogs, initialBlogs, blogsInDb, usersInDb
}