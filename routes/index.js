var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
    markdown = require('markdown').markdown;
module.exports = function (app) {
  var posts;
  app.get('/', function (req, res) {
    var promise = Post.find({}).sort({time: -1}).exec(function (err, post) {
      if (err && !post) {
        posts = [];
      }
      posts = post;
      posts.forEach(function (doc) {
        doc.post = markdown.toHTML(doc.post);
      });
    });
    promise.then(function () {
      res.render('index', {
        title: '主页',
        user: req.session.user,
        posts: posts,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.use('/reg', require('./reg.js'));

  app.use('/login', require('./login.js'));

  app.use('/post', require('./post.js'));

  app.use('/logout', require('./logout.js'));

  app.use('/upload', require('./upload.js'));

  app.use('/u', require('./u.js'));

  app.use('/edit', require('./edit.js'));

  app.use('/remove', require('./remove.js'));

  app.use(function (req, res) {
    res.render("404");
  })
}
