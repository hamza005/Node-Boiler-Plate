const userModel = require('../models/user.model');
const multer = require('multer');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config/auth.config');

exports.signup = (req, res) => {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    let user = new userModel();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = hashedPassword;
    user.image = req.file.path;
    user.save()
        .then(data => {
            var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ status: 1, success: true, token: token, data: data });
        }).catch(err => {
            return res.status(200).send({ status: 0, success: false, message: err.message })
        });
}
exports.getUsers = (req, res) => {
    userModel.find().select('name age image').exec()
        .then(docs => {
            const usersList = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        name: doc.name,
                        email: doc.email,
                        image: 'http://localhost:1234/' + doc.image,
                        id: doc._id,
                        // request: {
                        //     type: 'GET',
                        //     url: 'http://localhost:1234/' + doc._id
                        // }
                    }
                })
            }
            res.status(200).send({ 'data': usersList });
        })
        .catch(err => { next(err) });
}
exports.findId = (req, res) => {
    let token = req.headers['x-access-token'];
    let id = req.body.id;
    if (!token) { return res.status(401).send({ auth: false, message: 'Unauthorized Access!' }); }
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) { return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' }); }
        userModel.findById(id, { password: 0 })
            .then(doc => {
                if (!doc) { return res.status(404).send({ auth: true, message: 'No Record Found!' }); }
                doc.image = 'http://localhost:1234/' + doc.image;
                return res.status(200).send(doc);
            })
            .catch(err => { next(err) });
    });
}
exports.login = (req, res) => {
    userModel.findOne({ email: req.body.email })
        .then(user => {
            if (!user) { return res.status(404).send({ status: 0, success: false, message: 'No user found.' }) }
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) { return res.status(401).send({ status: 0, success: false, message: 'Unauthorized Access!' }) }
            if (passwordIsValid && req.body.email === user.email) {
                var token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ status: 1, success: true, token: token });
            }
        })
        .catch(err => {
            return res.status(500).send({ status: 0, success: false, message: err.message })
        })
}
