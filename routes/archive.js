var express = require('express');
var router = express.Router();
var Post = require('../models/post')


router.get('/', function (req, res) {
  var promise = Post.find({}).select('name time title').sort({time: -1}).exec();
  promise.then(function (posts) {
    res.render('archive', {
      title: '存档',
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  },
function (err) {
  req.flash('error', err);
  res.redirect('/');
});
});


module.exports = router;
