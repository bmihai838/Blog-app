const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Login functionality', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://127.0.0.1:3003/api/testing/reset')

    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'testpassword',
    }

    await request.post('http://127.0.0.1:3003/api/users', { data: newUser });
    await page.context().clearCookies()
})

    test('Login form is shown', async ({ page }) => {
      await page.goto('http://localhost:5173');
      await expect(page.locator('text=Log in to application')).toBeVisible()
    })

    test('succeeds with correct credentials', async ({ page }) => {
      await page.goto('http://localhost:5173')

      await page.fill('input[name="Username"]', 'testuser');
      await page.fill('input[name="Password"]', 'testpassword');
      await page.click('button[type="submit"]')

      await expect(page.locator('text=Test User')).toBeVisible({ timeout: 20000});
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.goto('http://localhost:5173')

      await page.fill('input[name="Username"]', 'testuser');
      await page.fill('input[name="Password"]', 'wrongpassword');
      await page.click('button[type="submit"]')

      await expect(page.locator('.error')).toBeVisible();
      await expect(page.locator('.error')).toHaveText('Wrong credentials');
    })
  })
