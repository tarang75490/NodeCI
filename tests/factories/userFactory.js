const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = ()=>{
    // returning promise
    return new User({}).save()
}

