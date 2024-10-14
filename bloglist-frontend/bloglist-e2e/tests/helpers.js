const { expect } = require('@playwright/test')

async function createBlog(page, blog) {
    const responsePromise = page.waitForResponse((response) => 
        response.url().endsWith('/api/blogs') && response.status() === 201
    )

    await page.click('button:has-text("New Blog")')
    await expect(page.locator('input[name="title"]')).toBeVisible()
  
    await page.fill('input[name="title"]', blog.title)
    await page.fill('input[name="author"]', blog.author)
    await page.fill('input[name="url"]', blog.url)
  
    await page.click('button[type="submit"]')

    const response = await responsePromise
    const responseBody = await response.json()
    const blogId = responseBody.id

    const blogLocator = page.locator(`[data-testid="blog-${blogId}"]`)
    await expect(blogLocator).toBeVisible()
  
    await expect(page.locator('.success')).toBeVisible()
    await expect(page.locator('.success')).toHaveText(
      `A new blog ${blog.title} by ${blog.author} added`
    )

    return blogId
  }
  
  module.exports = {
    createBlog
  }