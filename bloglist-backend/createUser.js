const axios = require('axios') 

const createUser = async () => {
    try {
        const response = await axios.post('http://localhost:3003/api/users', {
            username: "testuser",
            name: "Test User",
            password: "secretpassword"
        })
        console.log('User created:', response.data)
    } catch(error) {
        console.error('Error creating user:', error.response.data)
    }
    }

createUser()