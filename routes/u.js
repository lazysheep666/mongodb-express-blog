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
    post.comments.forEach(function (comment, index) {
      comment.content = markdown.toHTML(comment.content);
    })
    res.render('article',{
      title: req.params.title,
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    })
  });
});

router.post('/:name/:day/:title', function (req, res) {
  var promise = Post.findOne({
   "name": req.params.name,
   "title": req.params.title,
   "time": req.params.day.split('-')[0] + '-' + req.params.day.split('-')[1] + '-' + req.params.day.split('-')[2] + ' ' + req.params.day.split('-')[3]
 }).exec(function (err, post) {
   if (err) {
     req.flash('error', err);
     return res.redirect('/');
   }
 });
 promise.then(function (post) {
   var date = new Date();
   var currentTime = date.getFullYear() + "-" + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
   var comment = {
     name: req.body.name,
     website: req.body.website,
     time: currentTime,
     content: req.body.content
   }
   post.update({$push: {'comments': comment}}).exec(function (err) {
     if (err) {
       req.flash('error', err);
       return res.redirect('back');
     }
     req.flash('success', '留言成功!');
     res.redirect('back');
   });
 });
});
module.exports = router;
