var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');

router.get('/', function (req, res) {
  Post.distinct('tags', function (err, tags) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    res.render('tags', {
      title: '标签',
      tags: tags,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/:tag', function (req, res) {
  Post.find({tags: {$in: [req.params.tag]}}).sort({time: -1}).exec(function (err, posts) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    res.render('tag', {
      title: 'Tag: ' + req.params.tag,
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});



module.exports = router;
