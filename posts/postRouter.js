const express = require('express');

const router = express.Router();
// bringing in our helper functions
const postDb = require('./postDb.js');

router.get('/', (req, res) => {
  // do your magic!
  postDb
    .get(req)
    .then(posts => {
      res.status(200).json({ posts });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'The posts could not be retrieved.' });
    });
});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
  postDb
    .getById(req.params.id)
    .then(post => {
      res.status(200).json({ post });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'The post could not be retrieved.' });
    });
});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
  let deletedPost = {};
  postDb.getById(req.params.id).then(post => {
    deletedPost = post;
  });

  postDb
    .remove(req.params.id)
    .then(count => {
      res
        .status(200)
        .json({ deletedPost, message: 'Post has been successfully deleted.' });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'The post could not be removed' });
    });
});

router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
  const changes = req.body;
  const id = req.params.id;
  postDb
    .update(id, changes)
    .then(count => {
      postDb.getById(id).then(updatedPost => {
        res
          .status(200)
          .json({ updatedPost, message: 'The post has been modified.' });
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'The post could not be modified.' });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const id = req.params.id;
  postDb.getById(id).then(post => {
    if (!post) {
      res.status(400).json({ message: 'invalid user id' });
    } else {
      req.post = post;
      next();
    }
  });
}

module.exports = router;
