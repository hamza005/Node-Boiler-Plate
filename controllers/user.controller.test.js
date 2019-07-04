const userController = require('./user.controller');

describe('userController', function() {
  it('should be a function', function() {
    expect(userController.login).toBeInstanceOf(Function);
  });
});
