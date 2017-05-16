var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var middlewares = require('../middlewares/middlewares.js');
router.get('/', middlewares.checkNotLogin, function (req, res) {
  res.render('login', {
    title: '登陆',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});


router.post('/', middlewares.checkNotLogin, function (req, res) {
  //生成密码的md5值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  //检查用户是否存在
  User.findOne({
    'name': req.body.name
  })
  .exec(function (err, user) {
    if (!user) {
      req.flash('error', '用户不存在!');
      return res.redirect('/login');//用户不存在跳转至登陆页
    }
    //检查密码是否一致
    if (user.password != req.body.password) {
      req.flash('error', '密码错误!');
      return res.redirect('/login');//密码错误跳转到登陆页
    }
    req.session.user = user;
    req.flash('success', '登陆成功!');
    res.redirect('/');//登陆成功后跳转到主页
  });
});

module.exports = router;
