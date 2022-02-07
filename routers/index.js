/*
用来定义路由的路由器模块
 */
const express = require('express')
const jwt = require('jsonwebtoken')
//! --------加载user-rate数据-------------------------------


// 得到路由器对象
const router = express.Router()

// ******************************************************

require('./enroll')(router)
require('./login')(router)
require('./friend')(router)

module.exports = router;
