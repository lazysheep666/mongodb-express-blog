var express = require('express');
var router = express.Router();
var middlewares = require('../middlewares/middlewares.js');
var Post = require('../models/post.js');

router.get('/:name/:day/:title', middlewares.checkLogin, function (req, res) {
  Post.findOne({
    'name': req.session.user.name,
    'time': req.params.day.split('-')[0] + '-' + req.params.day.split('-')[1] + '-' + req.params.day.split('-')[2] + ' ' + req.params.day.split('-')[3],
    'title': req.params.title
  }).remove().exec(function (err, post) {
    if (err) {
      req.flash('error', 'error');
      return res.redirect('back');
    } else if (!post) {
      req.flash('error', '只有作者才能删除文章');
      return res.redirect('back');
    }
    req.flash('success', '删除成功!');
    res.redirect('/');
  });
})

module.exports = router;
