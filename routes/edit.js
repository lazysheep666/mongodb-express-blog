var express = require('express');
var router = express.Router();
var middlewares = require('../middlewares/middlewares.js');
var Post = require('../models/post.js');

router.get('/:name/:day/:title', middlewares.checkLogin, function (req, res) {
  Post.findOne({
    'name': req.session.user.name,
    'time': req.params.day.split('-')[0] + '-' + req.params.day.split('-')[1] + '-' + req.params.day.split('-')[2] + ' ' + req.params.day.split('-')[3],
    'title': req.params.title
  })
  .exec(function (err, post) {
    if (err) {
      req.flash('error', err);
      return res.redirect('back');
    } else if (!post) {
      req.flash('error', '只有作者本人才能编辑!');
      return res.redirect('back');
    }
    res.render('edit', {
      title: '编译',
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.post('/:name/:day/:title', middlewares.checkLogin, function (req, res) {
  Post.findOne({
    'name': req.session.user.name,
    'time': req.params.day.split('-')[0] + '-' + req.params.day.split('-')[1] + '-' + req.params.day.split('-')[2] + ' ' + req.params.day.split('-')[3],
    'title': req.params.title
  })
  .update({
    $set: {
      post: req.body.post
    }
  })
  .exec(function (err) {
    if (err) {
      req.flash('error', err);
      return res.redirect(encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title));//返回文章页
    }
    req.flash('success', '修改成功!');
    return res.redirect(encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title));//返回文章页
  });
})

module.exports = router;
