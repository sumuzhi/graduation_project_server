/*
应用的启动模块
1. 通过express启动服务器
2. 通过mongoose连接数据库
  说明: 只有当连接上数据库后才去启动服务器
3. 使用中间件
 */
const mongoose = require('mongoose')
const express = require('express')

const app = express() // 产生应用对象 

// 声明使用静态中间件
app.use(express.static('public'))

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// 声明使用解析post请求的中间件
// app.use(express.urlencoded({extended: true})) // 请求体参数是: name=tom&pwd=123
// app.use(express.json()) // 请求体参数是json结构: {name: tom, pwd: 123}

// 声明使用解析cookie数据的中间件
// const cookieParser = require('cookie-parser')
// app.use(cookieParser())

// 设定CORS跨域
// app.use((req, res, next) => {
//   // 设置响应头
//   res.set('Access-Control-Allow-Origin', '*');
//   // OPTIONS 预检请求，当请求方式不是get和post / 请求头包含非默认参数
//   // 预检请求作用：检查当前请求是否允许跨域
//   res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
//   res.set('Access-Control-Allow-Headers', 'content-type, authorization, accept');
//   res.set('Access-Control-Max-Age', 86400);
//   // 快速返回预检请求响应
//   if (req.method.toLowerCase() === 'options') {
//     // 命中了预检请求
//     return res.end();
//   }
//   next();
// });

// 声明使用token验证的中间件
// app.use(require('./middleware/token-verify'))
// const jwt = require('express-jwt');
// const jsonwebtoken = require('jsonwebtoken');
// const cors = require('cors');
// const jwtSecret = 'sumuzhi';
// app.get('/jwt', (req, res) => {
//   res.json({ token: jsonwebtoken.sign({ user: 'aaaaaa' }, jwtSecret) });
// });
// app.use(jwt({ secret: jwtSecret, algorithms: ['HS256'] }));
// const foods = [{ id: 1, description: 'burritos' }, { id: 2, description: 'quesadillas' }, { id: 3, description: 'churos' }];
// app.get('/foods', (req, res) => { res.json(foods); });


const users_model = require("./models/users_model")
const random = require("string-random") //用来生成qq号
// 得到路由器对象
const router = express.Router()
//! 注册
// username password userPhoto number_id signaturePerson
router.post('/enroll', (req, res) => {
  console.log(req.data);
  const {
    username,
    password,
    userPhoto,
    // number_id, //!服务器生成
    signaturePerson,
  } = req.body
  number_id = random(8, { letters: false });  //查询有没有同号的qq
  users_model.findOne({ number_id }).then(user => {
    console.log(user);
  })
  // 根据username和password查询数据库users, 如果没有, 返回提示错误的信息, 如果有, 返回登陆成功信息(包含user)
  /*   UserModel.findOne({
      username,
      password: md5(password)
    }, {
      password: 0,
      __v: 0
    })
      .then(user => {
        if (user) { // 登陆成功
          //签发token 指定过期时间 7 天
          const token = jwt.sign({
            id: user._id
          }, PRIVATE_KEY, {
            expiresIn: '7 days'
          });
          //const token = jwt.sign({id: user._id}, PRIVATE_KEY, { expiresIn: '15 s' });
  
          if (user.role_id) {
            RoleModel.findOne({
              _id: user.role_id
            })
              .then(role => {
                user._doc.role = role
                // 返回登陆成功信息(包含user和token)
                res.send({
                  status: 0,
                  data: {
                    user,
                    token
                  }
                })
              })
          } else {
            user._doc.role = {
              menus: []
            }
            // 返回登陆成功信息(包含user和token)
            res.send({
              status: 0,
              data: {
                user,
                token
              }
            })
          }
  
        } else { // 登陆失败
          res.send({
            status: 1,
            msg: '用户名或密码不正确!'
          })
        }
      })
      .catch(error => {
        console.error('登陆异常', error)
        res.send({
          status: 1,
          msg: '登陆异常, 请重新尝试'
        })
      }) */
})

//todo ------------------图片验证码--------------
// var svgCaptcha = require('svg-captcha');

// var c = svgCaptcha.create();
// console.log(c);
// app.get('/captcha', (req, res) => {
//   var captcha = svgCaptcha.create({
//     noise: 0,
//     width: 90,
//     height: 30,
//     fontSize: 35,
//   });
//   console.log(captcha.text);
//   res.type('svg');
//   res.status(200).send(captcha.data);
// });

//! 声明使用路由器中间件
const indexRouter = require('./routers')
app.use('/', indexRouter)

//! 通过mongoose连接数据库
const { SERVER_CONFIG, DB_CONFIG } = require('./config')
mongoose.connect(`mongodb://localhost:${DB_CONFIG.port}/${DB_CONFIG.name}`, { useNewUrlParser: true })
  .then(() => {
    console.log('连接数据库成功!!!')
    // 只有当连接上数据库后才去启动服务器
    app.listen(SERVER_CONFIG.port, () => {
      console.log(`服务器启动成功, 请访问: http://localhost:${SERVER_CONFIG.port}`)
    })
  })
  .catch(error => {
    console.error('连接数据库失败', error)
  })
