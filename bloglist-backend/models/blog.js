const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

blogSchema.set('toJSON', { 
    transform: (document, reuturnedObject) => {
        reuturnedObject.id = reuturnedObject._id.toString()
        delete reuturnedObject._id
        delete reuturnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)