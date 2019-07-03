const userController = require('../controllers/user.controller');
const image = require('../utility/fileupload.utility');
const token = require('../utility/verifytoken.utility');

module.exports = app => {
  app.get('/', token.jwtVerify, userController.getUsers);
  app.post('/signup', image, userController.signup);
  app.post('/findUser', token.jwtVerify, userController.findId);
  app.post('/login', userController.login);
  app.delete('/remove/:id', token.jwtVerify, userController.deleteUser);
};
