const mongoose = require('mongoose');

const schema = mongoose.Schema;
// eslint-disable-next-line new-cap
const userModel = new schema({
  name: String,
  email: String,
  password: String,
  image: String,
});

module.exports = mongoose.model('user', userModel);
