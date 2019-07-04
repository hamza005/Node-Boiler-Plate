const userController = require('../controllers/user.controller');
const file = require('../utility/fileupload.utility');
const auth = require('../utility/verifytoken.utility');

module.exports = app => {
  app.get('/', auth.jwtVerify, userController.getUsers);
  app.post('/signup', file, userController.signup);
  app.post('/findUser', auth.jwtVerify, userController.findId);
  app.post('/login', userController.login);
  app.delete('/remove/:id', auth.jwtVerify, userController.deleteUser);
};
