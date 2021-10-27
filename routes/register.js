'use strict';
const express = require('express');
const router = express.Router();
const uuid = require('uuid');
require('dotenv').config();

// '~/register'にGETアクセスが来たときの処理
router.get('/', function (req, res, next) {
  res.render('register', { title: 'サインアップ' });
});

// モジュールの読み込み
const crypto = require("crypto");

// モデルの読み込み
const Provisional = require('../models/provisional');
const Auth = require('../models/auth');

// '~/register'にPOSTアクセスが来たときの処理
router.post('/', function (req, res, next) {
  const mail = req.body.mail.toLowerCase()
  const name = esc(req.body.name);
  Provisional.count({ where: { mail: mail } }).then(proviCount => {
    Auth.count({ where: { mail: mail } }).then(authCount => {
      if (proviCount !== 0) {
        res.render('register', { title: '仮登録済' });
      }
      else if (authCount !== 0) {
        res.render('register', { title: '本登録済' });
      }
      else if (name.length == 0){
        res.render('register', { title: 'ユーザー名を入力してください' });
      }
      else if (name.length >= 16){
        res.render('register', { title: 'ユーザー名の長さが超過しています' });
      }
      else if (!mail.match(/[a-z0-9]+[a-z0-9\._-]*@[a-z0-9_-]+[a-z0-9\._-]+/)){
        res.render('register', { title: 'メールアドレスの形式が間違っています' });
      }
      else {
        const userId = uuid.v4();
        const password = hashing(req.body.password);
        const token = crypto.randomBytes(16).toString('hex');
        const hashedToken = hashing(token);
        Provisional.upsert({
          userId: userId,
          name:name,
          mail: mail,
          password: password,
          token: hashedToken
        }).then(() => {
          mailOptions.to = mail;
          mailOptions.html = '<p>以下のリンクからアカウントの確認を行ってください｡</p><br>   <a href="http://localhost:8000/auth/email/' + token + '" rel="noopener"><p>アカウントを確認</p></a>';
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Message sent: ' + info.accepted);
              res.render('register', { title: 'アカウントの確認' });
            }
          });
        });
      }
    })
  });
});
function hashing(data) {
  const shasum = crypto.createHash('SHA256');
  shasum.update(data);
  let hash = shasum.digest('hex');
  return hash;
}
const esc = string =>{
  string = string.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/`/g, '&#x60;');
  return string
}
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.mailad,
    pass: process.env.mailpass
  }
});
const mailOptions = {
  from: 'tasker',
  subject: 'アカウントの確認'
};

module.exports = router;