//app.js
const express = require('express');
const app = express();

const audioRoutes = require('./routes/audioRoutes');


app.use(express.static('public'));
app.use('/', audioRoutes)


module.exports = {app}