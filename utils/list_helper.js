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

module.exports = {
    dummy, totalLikes, favoriteBlog, mostLikes, mostBlogs
}