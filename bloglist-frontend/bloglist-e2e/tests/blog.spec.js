const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createBlog } = require('./helpers')

describe('Blog functionality', () => {
  beforeEach(async ({ page, request }) => {
    const resetResponse = await request.post('http://localhost:3003/api/testing/reset')
    if (resetResponse.status() !== 204) {
        throw new Error('Failed to reset the database');
      }    

    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'testpassword',
    }
    await request.post('http://localhost:3003/api/users', { data: newUser })

    await page.goto('http://localhost:5173')
    await page.fill('input[name="Username"]', 'testuser')
    await page.fill('input[name="Password"]', 'testpassword')
    await page.click('button[type="submit"]')

    await page.waitForResponse(response => 
        response.url().includes('/api/login') && response.status() === 200
    )

    await page.waitForTimeout(500)
    await expect(page.locator('text=Test User logged in')).toBeVisible({ timeout: 20000})
  })

  test('A logged-in user can create a blog', async ({ page }) => {
    
    const blog = {
        title: 'Test Title',
        author: 'Test Author',
        url: 'http://test-url.com',
      }

    await createBlog(page, blog)
  })
  test('A logged-in user can like a blog', async ({ page }) => {

    const blog = {
        title: 'Test Blog For Liking',
        author: 'Test Author',
        url: 'http://test-url.com',
      }

    const blogId = await createBlog(page, blog)

    const blogLocator = page.locator(`[data-testid="blog-${blogId}"]`)

    await blogLocator.getByRole('button', { name: 'view' }).click()

    await expect(blogLocator.locator('text=/likes \\d+/')).toBeVisible()

    const likesText = await blogLocator.locator('text=/likes \\d+/').textContent()
    const initialLikes = parseInt(likesText.replace('likes ', ''), 10)

    await blogLocator.getByRole('button', { name: 'like' }).click({ force: true })

    await page.waitForResponse(response => 
        response.url().includes('/api/blogs') && response.status() === 200
      )

    await expect(blogLocator.locator(`text=likes ${initialLikes + 1}`)).toBeVisible({ timeout: 20000})

  })
})
