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
// 得到路由器对象
const router = express.Router()


router.get('/', (req, res) => {
  res.send("Hello world")
})

function getNumber() {
  let number_id = random(8, { letters: false })
  while (number_id[0] == '0') {
    number_id = random(8, { letters: false })
  }
  return number_id
}

//! 注册
// username password userPhoto number_id signaturePerson
router.post('/enroll', (req, res) => {
  console.log(req.body);
  // res.send("hello")
  const {
    username,
    password,
    userPhoto,
    // number_id, //!服务器生成
    signaturePerson,
  } = req.body
  number_id = getNumber()  //查询有没有同号的qq

  console.log(username, password, userPhoto, signaturePerson, number_id);

  users_model.findOne({ username: username }).then(state => {
    if (!state) {
      users_model.create({
        number_id: number_id,
        username: username,
        password: md5(password),
        userPhoto: userPhoto,
        signaturePerson: signaturePerson
      })
        .then(user => {
          console.log("创建", username, "成功");
          res.send({ status: 200, msg: "用户注册成功" });
        })
    } else {
      res.send({ status: 201, msg: "此用户已存在，请前往登录" });
    }
  })
  // // 根据username和password查询数据库users, 如果没有, 返回提示错误的信息, 如果有, 返回登陆成功信息(包含user)
  // UserModel.findOne({
  //   username,
  //   password: md5(password)
  // }, {
  //   password: 0,
  //   __v: 0
  // })
  //   .then(user => {
  //     if (user) { // 登陆成功
  //       //签发token 指定过期时间 7 天
  //       const token = jwt.sign({
  //         id: user._id
  //       }, PRIVATE_KEY, {
  //         expiresIn: '7 days'
  //       });
  //       //const token = jwt.sign({id: user._id}, PRIVATE_KEY, { expiresIn: '15 s' });

  //       if (user.role_id) {
  //         RoleModel.findOne({
  //           _id: user.role_id
  //         })
  //           .then(role => {
  //             user._doc.role = role
  //             // 返回登陆成功信息(包含user和token)
  //             res.send({
  //               status: 0,
  //               data: {
  //                 user,
  //                 token
  //               }
  //             })
  //           })
  //       } else {
  //         user._doc.role = {
  //           menus: []
  //         }
  //         // 返回登陆成功信息(包含user和token)
  //         res.send({
  //           status: 0,
  //           data: {
  //             user,
  //             token
  //           }
  //         })
  //       }

  //     } else { // 登陆失败
  //       res.send({
  //         status: 1,
  //         msg: '用户名或密码不正确!'
  //       })
  //     }
  //   })
  //   .catch(error => {
  //     console.error('登陆异常', error)
  //     res.send({
  //       status: 1,
  //       msg: '登陆异常, 请重新尝试'
  //     })
  //   })
})

//! 登录
router.post('/login', (req, res) => {
  console.log(req.body);
  // res.send("hello")
  const {
    username,
    password,
  } = req.body


  users_model.findOne({
    username: username,
    password: md5(password)
  }).then(state => {
    if(state){
      res.send({status:200,msg:"登录成功"})
    }else{
      res.send({status:201,msg:"该用户未注册，请前往注册页面"})
    }
  })

})
// ******************************************************
/* 
 
router.get('/home', (req, res) => {
  console.log("home......");
  rateModel.find({})
    .then((data) => {
      res.send({ status: 0, data: data })
    })
})
 
router.get('/bar_buy_10', (req, res) => {
  console.log("bar_buy......");
  buy_10_Model.find({})
    .then((data) => {
      res.send({ status: 0, data: data })
    })
})
 
router.get('/bar_pv_10', (req, res) => {
  console.log("bar_pv......");
  pv_10_Model.find({})
    .then((data) => {
      // console.log(data);
      res.send({ status: 0, data: data })
    })
})
 
router.get('/bar_cart_10', (req, res) => {
  console.log("bar_cart......");
  cart_10_Model.find({})
    .then((data) => {
      res.send({ status: 0, data: data })
    })
})
 
router.get('/bar_fav_10', (req, res) => {
  fav_10_Model.find({})
    .then((data) => {
      res.send({ status: 0, data: data })
    })
})
 
router.get('/pv_10_buy', (req, res) => {
  pv_10_buy_Model.find({})
    .then((data) => {
      // console.log(data)
      res.send({ status: 0, data: data })
    })
})
 
router.get('/buy_10_pv', (req, res) => {
  buy_10_pv_Model.find({})
    .then((data) => {
      // console.log(data)
      res.send({ status: 0, data: data })
    })
})
 
router.get('/pv_uv_hours', (req, res) => {
  pv_uv_hours_Model.find({})
    .then((data) => {
      // console.log(data)
      res.send({ status: 0, data: data })
    })
})
 
 
router.get('/pv_uv_daily', (req, res) => {
  pv_uv_daily_Model.find({})
    .then((data) => {
      console.log(data)
      res.send({ status: 0, data: data })
    })
})
 
router.get('/user_analysic', (req, res) => {
  user_analysic_Model.find({})
    .then((data) => {
      console.log(data)
      res.send({ status: 0, data: data })
    })
})
 
 
router.get('/user_analysic_loudou', (req, res) => {
  user_analysic_loudou_Model.find({})
    .then((data) => {
      // console.log(data)
      res.send({ status: 0, data: data })
    })
})
 
router.get('/retention', (req, res) => {
  rentention_Model.find({})
    .then((data) => {
      res.send(data)
      // console.log(data)
    })
})
 
 
router.post('/recommend', (req, res) => {
  const { item_id } = req.body
  var aaa
  recommend_Model.find({ "product_pre": { $regex: item_id } }).sort({ probability: -1 }).limit(50)
    .then((data) => {
      res.send({ status: 0, data: data })
    })
})
 
router.post('/get_category_of_item_id', (req, res) => {
  const { item_id } = req.body
  console.log(item_id)
  item_category_Model.find({ "item_id": Number(item_id) }, { category_id: 1, _id: 0 })
    .then((data) => {
      res.send({ status: 0, data: data[0] })
    })
})
 */
// **********************************************************


// require('./login')(router)
// require('./product')(router)
// require('./role')(router)
// require('./user')(router)
// require('./file-upload')(router)

module.exports = router;
