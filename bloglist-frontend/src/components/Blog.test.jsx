import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import Blog from './Blog'

let blog 
let mockUpdateLikes
let mockDeleteBlog

beforeEach(() => {
    blog = {
        url: 'http://testurl.com',
        title: 'Component testing is done with react-testing-library',
        author: 'Test Author',
        likes: 5,
    }

    mockUpdateLikes = vi.fn()
    mockDeleteBlog = vi.fn()

    render(
        <Blog
            blog={blog}
            updateLikes={mockUpdateLikes}
            deleteBlog={mockDeleteBlog}
        />
    )
})

test('renders content', () => {
    expect(screen.getByText(/Component testing is done with react-testing-library/i)).toBeInTheDocument()
    expect(screen.getByText(/Test Author/i)).toBeInTheDocument()

    expect(screen.queryByText(blog.url)).not.toBeInTheDocument()
    expect(screen.queryByText(/likes/i)).not.toBeInTheDocument()
})

test('url and likes are shown when clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText(blog.url)).toBeInTheDocument()
    expect(screen.getByText(`likes ${blog.likes}`)).toBeInTheDocument()
})

test('like even handler is called twice', async () => {
    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdateLikes).toHaveBeenCalledTimes(2)
})