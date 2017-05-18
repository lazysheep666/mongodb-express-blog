var mongoose = require('./db.js');

var PostSchema = new mongoose.Schema({
  name: String,
  time: String,
  title: String,
  post: String,
  tags: [String],
  comments: [{
    name: String,
    website: String,
    time: String,
    content: String
  }],
  pv: {
    type: Number,
    default: 0
  }
});

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;
