const express = require('express');
// bringing in our helper functions
const postDb = require('../posts/postDb');
const userDb = require('../users/userDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  const userData = req.body;
  userDb
    .insert(userData)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: 'There was an error while saving the new user to the database.'
      });
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const postData = req.body;
  postDb
    .insert(postData)
    .then(newPost => {
      res.status(201).json(newPost);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: 'There was an error while saving the new post to the database.'
      });
    });
});

router.get('/', (req, res) => {
  // do your magic!
  userDb
    .get(req)
    .then(users => {
      res.status(200).json({ users });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'The users could not be retrieved.' });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  userDb
    .getById(req.params.id)
    .then(user => {
      res.status(200).json({ user });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'The user could not be retrieved.' });
    });
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
  userDb
    .getUserPosts(req.params.id)
    .then(userPosts => {
      res.status(200).json({ userPosts });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'The user could not be retrieved.' });
    });
});

router.delete('/:id', (req, res) => {
  // do your magic!
  let deletedUser = {};
  userDb.getById(req.params.id).then(user => {
    deletedUser = user;
  });

  userDb
    .remove(req.params.id)
    .then(count => {
      res
        .status(200)
        .json({ deletedUser, message: 'User has been successfully deleted.' });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'The user could not be removed' });
    });
});

router.put('/:id', (req, res) => {
  // do your magic!
  const changes = req.body;
  const id = req.params.id;
  userDb
    .update(id, changes)
    .then(count => {
      userDb.getById(id).then(updatedUser => {
        res
          .status(200)
          .json({ updatedUser, message: 'The user has been modified.' });
      });
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: 'The user information could not be modified.' });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const id = req.params.id;
  userDb.getById(id).then(user => {
    if (!user) {
      res.status(400).json({ message: 'invalid user id' });
    } else {
      req.user = user;
      next();
    }
  });
}

function validateUser(req, res, next) {
  // do your magic!
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: 'missing user data' });
  } else if (!req.body.name) {
    res.status(400).json({ message: 'missing required name field' });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: 'missing post data' });
  } else if (!req.body.text) {
    res.status(400).json({ message: 'missing required text field' });
  } else {
    next();
  }
}

module.exports = router;
