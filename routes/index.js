const express = require('express');
const router = express.Router();

const User = require('../models/user');


/* GET home page. */
router.get('/', async function (req, res, next) {
  if (req.session.usersess == undefined) {
    res.render("login", { title: "ログイン" });
  }
  else {
    const userId = req.session.usersess["user"]
    const user = await User.findOne({
      where: {
        userId: userId
      }
    })
    if (user) {
      res.render('index', { title: 'Express', user: user });
    }
    else {
      res.render("login", { title: "ログイン" });
    }
  }
});

module.exports = router;
