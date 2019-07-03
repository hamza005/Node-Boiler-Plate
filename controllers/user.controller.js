/* eslint-disable no-undef */
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const config = require('../config/auth.config');

exports.signup = (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  const user = new userModel();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = hashedPassword;
  user.image = req.file.path;
  userModel
    .findOne({ email: req.body.email })
    .exec()
    .then(data => {
      if (data) {
        if (data.email === req.body.email) {
          return res.status(200).send({
            success: true,
            message: `${req.body.email} already exists.`,
          });
        }
      }
    });
  user
    .save()
    .then(data => {
      const token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400, // expires in 24 hours
      });
      data.image = process.env.HOST_URL + data.image;
      res.status(200).send({ status: 1, success: true, token, data });
    })
    .catch(err =>
      res.status(200).send({ status: 0, success: false, message: err.message })
    );
};
exports.getUsers = (req, res) => {
  userModel
    .find()
    .select('name image email password')
    .exec()
    .then(docs => {
      const usersList = {
        count: docs.length,
        users: docs.map(doc => ({
          name: doc.name,
          email: doc.email,
          image: process.env.HOST_URL + doc.image,
          id: doc._id,
          password: doc.password,
          // request: {
          //     type: 'GET',
          //     url: 'http://localhost:1234/' + doc._id
          // }
        })),
      };
      res.status(200).send({ success: true, status: 1, data: usersList });
    })
    .catch(err => {
      // eslint-disable-next-line no-undef
      next(err);
    });
};
exports.findId = (req, res) => {
  const { id } = req.body;
  userModel
    .findById(id, { password: 0 })
    .then(doc => {
      if (!doc) {
        return res.status(200).send({
          success: false,
          status: 0,
          auth: true,
          message: 'No Record Found!',
        });
      }
      doc.image = process.env.HOST_URL + doc.image;
      return res.status(200).send(doc);
    })
    .catch(err => {
      res.status(500).send({ status: 0, success: false, message: err.message });
    });
};
exports.login = (req, res) => {
  userModel
    .findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .send({ status: 0, success: false, message: 'No user found.' });
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res
          .status(401)
          .send({ status: 0, success: false, message: 'Unauthorized Access!' });
      }
      if (passwordIsValid && req.body.email === user.email) {
        const token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400, // expires in 24 hours
        });
        res.status(200).send({ status: 1, success: true, token });
      }
    })
    .catch(err =>
      res.status(500).send({ status: 0, success: false, message: err.message })
    );
};

exports.deleteUser = (req, res) => {
  userModel
    .deleteOne({ email: req.params.id })
    .exec()
    .then(data => {
      if (data.n === 0) {
        return res
          .status(200)
          .send({ success: false, status: 0, message: 'No User Found' });
      }
      return res.status(200).send({ success: true, message: data });
    });
};
