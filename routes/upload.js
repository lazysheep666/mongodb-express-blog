var express = require('express');
var router = express.Router();
var middlewares = require('../middlewares/middlewares.js');

router.get('/', middlewares.checkLogin, function (req, res) {
  res.render('upload', {
    title: '文件上传',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.post('/', middlewares.checkLogin, function (req, res) {
  req.flash('success', '文件上传成功!');
  res.redirect('/');
});


module.exports = router;
