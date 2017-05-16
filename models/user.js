var mongoose = require('./db.js');

var UserSchema = new mongoose.Schema({
  name: {type: String, index:true, unique: true},
  password: String,
  email: String
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
