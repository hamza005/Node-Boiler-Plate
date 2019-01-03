const mongoose = require('mongoose');
    let schema = mongoose.Schema;
    let userModel = new schema({
    'name': String,
    'email': String,
    'password':String,
    'image': String
});

module.exports = mongoose.model('user', userModel);

