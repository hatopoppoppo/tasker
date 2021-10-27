'use strict';
const express = require('express');
const router = express.Router();

// パッケージの読み込み
const crypto = require('crypto');
const pass = "passw0rdet"

// モデルの読み込み
const Provisional = require('../models/provisional');
const User = require('../models/user');
const Auth = require('../models/auth');

// '~/auth/email/:token'にGETアクセスが来たときの処理
router.get('/email/:token', function (req, res, next) {
  const autoId = createChar()
  const token = hashing(req.params.token);
  Provisional.findOne({
    where: {
      token: token
    }
  }).then(provision => {
    if (provision) {

      User.create({
        userId: provision.userId,
        name: provision.name,
      }).then(() => {
        Auth.create({
          userId: provision.userId,
          password: provision.password,
          mail: provision.mail
        }).then(() => {
          Provisional.destroy({
            where: {
              mail: provision.mail
            }
          }).then(() => {
            req.session.usersess = {user: provision.userId}
            res.redirect('/');
          });
        });
      });
    } else {
      res.render('auth', { title: '認証失敗' });
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
function createChar(){
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let autoId = '';
  for (let i = 0; i < 25; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return autoId
}

module.exports = router;