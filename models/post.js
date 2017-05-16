var mongoose = require('./db.js');

var PostSchema = new mongoose.Schema({
  name: String,
  time: String,
  title: String,
  post: String,
  comments: [{
    name: String,
    time: String,
    title: String,
    comment: String
  }]
});

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;
