'use strict';
const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('login', { title: 'ログイン' });
});

// モジュールの読み込み
const crypto = require("crypto");

// モデルの読み込み
const auth = require('../models/auth');

// '~/signup'にPOSTアクセスが来たときの処理
router.post('/', function (req, res, next) {
  const mail = req.body.mail.toLowerCase();
  const password = hashing(req.body.password);

  auth.findOne({
    where: {
      mail: mail
    }
  }).then(user => {
    if (user) {
      if (user.password === password) {
        req.session.usersess = { user: user.userId }
        res.redirect('/');

      }
      else {
        res.render('login', { title: 'ユーザー不適合' });
      }
    }
    else {
      res.render('login', { title: 'ユーザー不適合' });
    }
  });
});
// ハッシュ化関数
function hashing(data) {
  const shasum = crypto.createHash('SHA256');
  shasum.update(data);
  let hash = shasum.digest('hex');
  return hash;
}
const mailOptions = {
  from: 'tasker',
  subject: 'アカウントの確認'
};

module.exports = router;


