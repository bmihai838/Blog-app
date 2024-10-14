import { useState, useEffect, useRef, useId } from 'react'
import './index.css';
import Blog from './components/Blog'
import blogService from './services/blogs'
import BlogForm from './components/BlogForm'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable';

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)

  const usernameId = useId()
  const passwordId = useId()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({ message:'Logged in successfully', type: 'success' })
      setTimeout(() => setNotification(null), 5000)
    } catch (error) {
      setNotification({ message:'Wrong credentials', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
      console.error('Wrong credentials', error.message)
    } 
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const blogFormRef = useRef()

  const updateLikes = async (blogToUpdate) => {
    try {
      const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
      const returnedBlog = await blogService.update(updatedBlog.id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id === returnedBlog.id ? returnedBlog : blog))
    } catch (exception) {
      setNotification({ message:`Failed to update blog likes`, type:'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      console.log('Blog created:', returnedBlog)
      setBlogs((prevBlogs) => prevBlogs.concat(returnedBlog))
      setNotification({
        message: `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        type: 'success',
      })
      setTimeout(() => setNotification(null), 5000)
    } catch (error) {
      console.error('Failed to create blog:', error)
      setNotification({ message: 'Failed creating a new blog', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }
  
  const deleteBlog = async (id) => {
    const blogToDelete = blogs.find(blog => blog.id === id)

    if (window.confirm(`Remove blog ${blogToDelete} by ${blogToDelete.author}?`))
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
    } catch (error) {
      console.error('Failed to delete Blog', error.message)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification?.message} type={notification?.type}/>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor={usernameId}>Username:</label>
            <input 
              id={usernameId}
              type="text"
              value={username}
              name='Username'
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={passwordId}>Password:</label>
            <input 
             id={passwordId}
             type="password"
             value={password}
             name="Password"
             onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notification?.message} type={notification?.type}/>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>Logout</button>
      <h2>Create new blogs</h2>
      <Togglable buttonLabel="Create new Blog" ref={blogFormRef}>
      <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs
      .sort((a, b) => b.likes - a.likes)
      .map(blog =>
        <Blog 
         key={blog.id}
         blog={blog}
         updateLikes={updateLikes}
         deleteBlog={deleteBlog}
        />
      )}
    </div>
  )
}

export default App