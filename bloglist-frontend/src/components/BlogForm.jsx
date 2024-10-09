import { useState, useId } from 'react'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const titleId = useId()
    const authorId = useId()
    const urlId = useId()

    const handleSubmit = (event) => { 
        event.preventDefault()
        createBlog({ title, author, url })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return(
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor={titleId}>Title:</label>
                <input
                    id={titleId}
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}    
                />
            </div>
            <div>
                <label htmlFor={authorId}>Author:</label>
                <input
                    id={authorId}
                    type='text'
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor={urlId}>Url:</label>
                <input
                    id={urlId}
                    type="text"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                />
            </div>
            <button type='submit'>create</button>
        </form>
    )
}

export default BlogForm