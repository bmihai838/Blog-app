const { test, expect, beforeEach, describe } = require('@playwright/test')
const { error } = require('console')

describe('Login', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('api/testing/reset')
        await request.post('/api/users', {
            data: {
                username: 'e2etestuser',
                name: 'E2E Test User',
                password: 'correctpassword'
            }
        })
        await page.goto('http://localhost:5173')
    })

    test('succeds with correct credentials', async ({ page }) => {
        await page.getByLabel('username').fill('e2etestuser')
        await page.getByLabel('password').fill('correctpassword')
        await page.getByRole('button', { name: 'login' }).click()

        console.log(await page.content());

        await expect(page.getByText('Logged in successfully')).toBeVisible({ timeout: 5000 })
  
       
        await expect(page.getByText('E2E Test User logged in')).toBeVisible({ timeout: 5000 })
        
        
        await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.getByLabel('username').fill('testuser')
        await page.getByLabel('password').fill('wrongpassword')
        await page.getByRole('button', { name: 'login' }).click()

        const errorMessage = await page.getByText('Wrong Credentials')
        await expect(errorMessage).toBeVisible()
        await expect(errorMessage).toHaveCSS('background-color', 'rgb(248, 215, 218)')
        await expect(errorMessage).toHaveCSS('color', 'rgb(114, 28, 36)')
    })
})
