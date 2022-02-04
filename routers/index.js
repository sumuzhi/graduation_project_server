/*
用来定义路由的路由器模块
 */
const express = require('express')
const md5 = require('blueimp-md5')
const jwt = require('jsonwebtoken')

//! --------加载user-rate数据-------------------------------
/* const rateModel = require('../models/rateModel')
const buy_10_Model = require('../models/buy_10_Model')
const pv_10_Model = require('../models/pv_10_Model')
const cart_10_Model = require('../models/cart_10_Model')
const fav_10_Model = require('../models/fav_10_Model')
const pv_10_buy_Model = require('../models/pv_10_buy_Model')
const buy_10_pv_Model = require('../models/buy_10_pv_Model')
const pv_uv_hours_Model = require('../models/pv_uv_hours_Model')
const pv_uv_daily_Model = require('../models/pv_uv_daily_Model')
const user_analysic_Model = require('../models/user_analysic_Model')
const user_analysic_loudou_Model = require('../models/user_analysic_loudou_Model')
const recommend_Model = require('../models/recommend_Model')
const item_category_Model = require('../models/item_category_Model')
const rentention_Model = require('../models/retention_Model') */


/* const {
  PRIVATE_KEY
} = require('../config')
const UserModel = require('../models/UserModel')
const RoleModel = require('../models/RoleModel') */

const users_model = require("../models/users_model")
const random = require("string-random") //用来生成qq号
const multer = require('multer')

// 得到路由器对象
const router = express.Router()
var codeAns = '';  //! 服务器生成的code


router.get('/', (req, res) => {
  res.send("Hello world")
})

function createVerifyImg() {
  var captcha = svgCaptcha.create({
    noise: 0,
    width: 90,
    height: 30,
    fontSize: 35,
  });
  codeAns = captcha.text
  console.log(codeAns);
  return captcha
}

//todo ------------------图片验证码--------------
var svgCaptcha = require('svg-captcha');
var c = svgCaptcha.create();
router.get('/captcha', (req, res) => {
  captcha = createVerifyImg()
  res.type('svg');
  res.status(200).send(captcha.data);
});


//! ----------------接受头像-----------
const path = require('path')
const fs = require('fs')
const formidable = require("formidable");
const storage = multer.memoryStorage()
const upload = multer({ storage })
const uploadSingle = upload.any()

//! --------注册---------
// todo 生成随机数字串，第一位不为0
function getNumber() {
  let number_id = random(8, { letters: false })
  while (number_id[0] == '0') {
    number_id = random(8, { letters: false })
  }
  return number_id
}


//! ----------------登录-------------
router.post('/login', (req, res) => {
  const {
    username,
    password,
    code
  } = req.body
  if (codeAns == '') {
    res.send({ status: 201, msg: "此验证码已失效，请重新点击获取" })
    return
  }
  if (code.toLowerCase() !== codeAns.toLowerCase()) {
    res.send({ status: 201, msg: "验证码错误" })
    codeAns = ''
    return
  }
  users_model.findOne({
    username: username
  }).then(state => {
    if (state) {
      users_model.findOne({ password: md5(password) })
        .then((state) => {
          if (state)
            res.send({ status: 200, msg: "登录成功" })
          else
            res.send({ status: 201, msg: "用户名或密码错误" })
        })
    } else {
      res.send({ status: 201, msg: "该用户未注册，请前往注册页面" })
    }
  })
  createVerifyImg()
})
// ******************************************************


// require('./login')(router)
// require('./product')(router)
// require('./role')(router)
// require('./user')(router)
// require('./file-upload')(router)

module.exports = router;
