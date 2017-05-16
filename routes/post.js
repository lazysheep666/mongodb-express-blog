var express = require('express');
var router = express.Router();
var Post = require('../models/post.js')
var middlewares = require('../middlewares/middlewares.js');

router.get('/', middlewares.checkLogin, function (req, res) {
  res.render('post', {
    title: '发表',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
router.post('/', middlewares.checkLogin, function (req, res) {
  var currentUser = req.session.user.name;
  var date = new Date();
  var currentTime = date.getFullYear() + "-" + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  post = new Post({
    'name': currentUser,
    'time': currentTime,
    'title': req.body.title,
    'post': req.body.post
  });

  post.save(function (err, post) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    req.flash('success', '发布成功');
    res.redirect('/');//发表成功跳转到主页
  });
});

module.exports = router;
