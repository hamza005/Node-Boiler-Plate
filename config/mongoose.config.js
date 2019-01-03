const mongoose = require('mongoose');
module.exports = (mongoose) => {
    mongoose.connect("mongodb://127.0.0.1:27017/testdb", { useNewUrlParser: true })
        .then(() => {
            console.log('Mongo Connected');
        }).catch((err) => {
            console.log(err.message)
        });
}