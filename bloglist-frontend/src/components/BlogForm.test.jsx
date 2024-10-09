import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, vi } from 'vitest'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
    test('updates parent state and calls onSubmit', async () => {
        const createBlog = vi.fn()
        const user = userEvent.setup()

        render(<BlogForm createBlog={createBlog}/>)

        const titleInput = screen.getByRole('textbox', { name: /title:/i })
        const authorInput = screen.getByRole('textbox', { name: /author:/i })
        const urlInput = screen.getByRole('textbox', { name: /url:/i })
        const createButton = screen.getByRole('button', { name: /create/i })

        await user.type(titleInput, 'Test Title')
        await user.type(authorInput, 'Test Author')
        await user.type(urlInput, 'http://test.com')
        await user.click(createButton)

        expect(createBlog).toHaveBeenCalledTimes(1)
        expect(createBlog).toHaveBeenCalledWith({
            title: 'Test Title',
            author: 'Test Author',
            url: 'http://test.com'
        })
    })
})
