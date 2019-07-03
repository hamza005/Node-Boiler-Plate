const mongoose = require('mongoose');

module.exports = mongoose => {
  mongoose
    .connect(
      'mongodb+srv://hamza:Humza673@testdb-87tve.mongodb.net/test?retryWrites=true&w=majority',
      { useNewUrlParser: true }
    )
    .then(() => {
      console.log('Mongo DB Connected');
    })
    .catch(err => {
      console.log(err.message);
    });
};
