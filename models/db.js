var mongoose = require('mongoose');
var URL = "mongodb://localhost:27017/blog";
mongoose.connect(URL);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + URL);
});


mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});


mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

module.exports = mongoose;
