/*
用来定义路由的路由器模块
 */
const router = require("express").Router()
// const express = require('express')
const jwt = require('jsonwebtoken')
//! --------加载user-rate数据-------------------------------

// ******************************************************

require('./enroll')(router)
require('./login')(router)
require('./friend')(router)
require('./conversations')(router)
require('./messages')(router)

module.exports = router;
