const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body
    console.log('Login request recieved for user:', username)

    const user = await User.findOne({ username })
    console.log('User found:', user ? 'Yes' : 'No')

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)
    console.log('Password correct:', passwordCorrect)

    if (!(user && passwordCorrect)) {
        console.log('Login failed: invalid username or password')
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    console.log('Login successful for user', username)
    response
        .status(200)
        .send({ token, username: user.username, name: user.name})
})

module.exports = loginRouter