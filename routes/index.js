var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
    markdown = require('markdown').markdown;
module.exports = function (app) {
  var total;
  app.get('/', function (req, res) {
    var page = req.query.p ? parseInt(req.query.p) : 1;
    var promise = Post.find({}).exec();
    promise.then(function (posts) {
      total = posts.length;
      return  Post.find({}).sort({time: -1}).skip((page - 1) * 10).limit(10).exec()
    }).then(function (posts) {
      posts.forEach(function (doc) {
        doc.post = markdown.toHTML(doc.post);
      });
      res.render('index', {
        title: '主页',
        user: req.session.user,
        posts: posts,
        page: page,
        isFirstPage: (page - 1) == 0,
        isLastPage: ((page - 1) * 10 + posts.length) == total,
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

  app.use('/archive', require('./archive.js'));

  app.use('/tags', require('./tags.js'));

  app.use('/search',require('./search.js'));

  app.use('/u', require('./u.js'));

  app.use('/edit', require('./edit.js'));

  app.use('/remove', require('./remove.js'));

  app.use(function (req, res) {
    res.render("404");
  })
}
