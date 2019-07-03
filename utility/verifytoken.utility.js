const jwt = require('jsonwebtoken');
// eslint-disable-next-line camelcase
const secret_key = require('../config/auth.config').secret;

function jwtVerify(req, res, next) {
  // getting token
  let token =
    req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    try {
      // eslint-disable-next-line prefer-destructuring
      token = req.headers.authorization.split(' ')[1];
    } catch (e) {
      console.log('token not found in any given params');
    }
  }
  jwt.verify(token, secret_key, (err, authData) => {
    if (err) {
      return res.status(401).send({
        success: false,
        error: true,
        message: err,
      });
    }
    console.log('executing next...');
    next();
  });
}
module.exports = {
  jwtVerify,
};
