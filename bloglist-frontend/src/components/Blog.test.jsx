import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect, vi } from 'vitest'

test('renders content', () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Test Author',
        url: 'http://testurl.com',
        likes: 5,
    }

    const mockUpdateLikes = vi.fn()
    const mockDeleteBlog = vi.fn()

    render(
        <Blog
            blog={blog}
            updateLikes={mockUpdateLikes}
            deleteBlog={mockDeleteBlog}
        />
    )

    expect(screen.getByText(/Component testing is done with react-testing-library/i)).toBeInTheDocument()
    expect(screen.getByText(/Test Author/i)).toBeInTheDocument()

    expect(screen.queryByText(blog.url)).not.toBeInTheDocument()
    expect(screen.queryByText(/likes/i)).not.toBeInTheDocument()
})