var express = require('express');
var router = express.Router();
var Post = require('../models/post');

router.get('/', function (req, res) {
  Post.find({'title': req.query.keyword}).exec(function (err, posts) {
    if (err) {
      req.flash('error', err);
      return res.redirct('/');
    }
    res.render('search', {
      title: "Search: " + req.query.keyword,
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
;})


module.exports = router;
