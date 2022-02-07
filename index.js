const mongoose = require('mongoose')
const express = require('express')

const app = express() // 产生应用对象 


// 声明使用静态中间件
// app.use(express.static('public'))

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) 


/* // 声明使用解析post请求的中间件
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
// }); */

/* 声明使用token验证的中间件
app.use(require('./middleware/token-verify'))
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');
const jwtSecret = 'sumuzhi';
app.get('/jwt', (req, res) => {
  res.json({ token: jsonwebtoken.sign({ user: 'aaaaaa' }, jwtSecret) });
});
app.use(jwt({ secret: jwtSecret, algorithms: ['HS256'] }));
const foods = [{ id: 1, description: 'burritos' }, { id: 2, description: 'quesadillas' }, { id: 3, description: 'churos' }];
app.get('/foods', (req, res) => { res.json(foods); }); */


const users_model = require("./models/users_model")
// 得到路由器对象
const router = express.Router()


//! 使用-----socket.io
const server = require('http').createServer(app) //socket.io使用

require('./socket/test')(server)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// //! 声明使用路由器中间件
const indexRouter = require('./routers')
app.use('/', indexRouter)



//! 通过mongoose连接数据库(使用socket.io后需要将app改为server)
const { SERVER_CONFIG, DB_CONFIG } = require('./config')
mongoose.connect(`mongodb://localhost:${DB_CONFIG.port}/${DB_CONFIG.name}`, { useNewUrlParser: true })
  .then(() => {
    console.log('连接数据库成功!!!')
    // 只有当连接上数据库后才去启动服务器
    server.listen(SERVER_CONFIG.port, () => {
      console.log(`服务器启动成功, 请访问: http://localhost:${SERVER_CONFIG.port}`)
    })
  })
  .catch(error => {
    console.error('连接数据库失败', error)
  })
