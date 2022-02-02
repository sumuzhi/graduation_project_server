/*
  权限token验证的中间件
 */
const jwt = require('jsonwebtoken');
const { PRIVATE_KEY, UN_CHECK_PATHS } = require('../config');

module.exports = function (req, res, next) {
  const url = req.url;

  console.log(UN_CHECK_PATHS, url)
  
  if (UN_CHECK_PATHS.indexOf(url) !==-1) {
    return next();
  }

  // 其他所有请求都要验证token
  let token = req.headers['authorization'];  

  if (!token) {
    return res.status(401).json({
      status: 1,
      msg: '你没有登录，需要登录才能使用'
    })
  }
  token = token.slice(8);
  // 有token进行校验
  jwt.verify(token, PRIVATE_KEY, (err, data) => {
    if (err) {
      return res.status(401).json({
        status: 2,
        msg: 'token过期失效'
      })
    } else {
      req.user = data; 
      return next();
    }
  })

};
