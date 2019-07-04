const express = require('express');
const mongoose = require('mongoose');

const app = express();
require('dotenv').config();
require('./config/express.config')(app);
require('./routes/user.route')(app);
require('./config/mongoose.config')(mongoose);
require('./routes/routerHandler')(app);

app.use('/uploads', express.static('uploads'));
app.listen(process.env.PORT, () => {
  console.log(`magic is happening on ${process.env.PORT}`);
});
