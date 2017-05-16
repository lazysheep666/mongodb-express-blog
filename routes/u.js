var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');
var User = require('../models/user.js');
var markdown = require('markdown').markdown;
var posts;
var user;
router.get('/:name', function (req, res) {
  //检查用户名是否存在
  User.findOne({"name": req.params.name}).exec(function (err, output) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');//跳转到主页
    } else if (!output) {
      req.flash('error', '未找到用户');
      return res.redirect('/');//跳转到主页
    }
    user = output;
  });

  var promise = Post.find({"name": req.params.name}).sort({time: -1}).exec(function (err, post) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    posts = post;
    posts.forEach(function (doc) {
      doc.post = markdown.toHTML(doc.post);
    });
  });

  promise.then(function () {
    res.render('user', {
      title: user.name,
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/:name/:day/:title', function (req, res) {
   Post.findOne({
    "name": req.params.name,
    "title": req.params.title,
    "time": req.params.day.split('-')[0] + '-' + req.params.day.split('-')[1] + '-' + req.params.day.split('-')[2] + ' ' + req.params.day.split('-')[3]
  }).exec(function (err, post) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    post.post = markdown.toHTML(post.post);
    res.render('article',{
      title: req.params.title,
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    })
  });
});
module.exports = router;
