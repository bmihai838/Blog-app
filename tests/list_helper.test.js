const { test, describe } = require('node:test')
const assert = require('node:assert')
const list_helper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []
    const result = list_helper.dummy(blogs)
    assert.strictEqual(result, 1)
})



describe('total likes', () => {
    test('of empty list is zero', () => {
      assert.strictEqual(list_helper.totalLikes([]), 0)
    })
  
    test('when list has only one blog, equals the likes of that', () => {
      const listWithOneBlog = [
        {
          likes: 5
        }
      ]
      assert.strictEqual(list_helper.totalLikes(listWithOneBlog), 5)
    })
  
    test('of a bigger list is calculated right', () => {
      const blogs = [
        { likes: 5 },
        { likes: 10 },
        { likes: 15 }
      ]
      assert.strictEqual(list_helper.totalLikes(blogs), 30)
    })
  })

  describe('favorite blog', () => {
    const blogs = [
        { title: "b1", author: "Dani", likes: 5},
        { title: "b2", author: "Dani", likes: 12},
        { title: "b3", author: "Varcolacu", likes: 15},
        { title: "b4", author: "Andrei", likes: 14}
    ]

    const result = list_helper.favoriteBlog(blogs)

    test('when list has multiple blogs, return the one with most likes', () => {
        
        assert.deepStrictEqual(result, {
            title: "b3",
            author: "Varcolacu",
            likes: 15})
    })
  })

  describe('most likes', () => {
    const blogs = [
        { title: "b1", author: "Dani", likes: 5},
        { title: "b2", author: "Dani", likes: 12},
        { title: "b3", author: "Varcolacu", likes: 15},
        { title: "b4", author: "Andrei", likes: 14}
    ]

    test('when list has multiple blogs, return the author with most total likes', () => {
        const result = list_helper.mostLikes(blogs)
        assert.deepStrictEqual(result, {
            author: "Dani",
            likes: 17
        })
    })
  })

  describe('most blogs', () => {
    const blogs = [
        { title: "b1", author: "Dani", likes: 5},
        { title: "b2", author: "Dani", likes: 12},
        { title: "b3", author: "Varcolacu", likes: 15},
        { title: "b4", author: "Andrei", likes: 14}
    ]

    test('return the author with most total blogs', () => {
        const result = list_helper.mostBlogs(blogs)
        assert.deepStrictEqual(result, {author: "Dani", blogs: 2 })
    })
  })