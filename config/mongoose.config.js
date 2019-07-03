const mongoose = require('mongoose');

module.exports = mongoose => {
  mongoose
    .connect(process.env.DB_HOST, { useNewUrlParser: true })
    .then(() => {
      console.log('Mongo DB Connected');
    })
    .catch(err => {
      console.log(err.message);
    });
};
