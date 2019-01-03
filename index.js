const express = require('express');
const mongoose = require('mongoose');
const app = express();
require ('./config/express.config')(app)
require ('./routes/user.route')(app);
require ('./config/mongoose.config')(mongoose);
app.use('/uploads',express.static('uploads'));

let port = '1234';
app.listen(port, '0.0.0.0', ()=>{
    console.log('magic is happening on ' + port);
})