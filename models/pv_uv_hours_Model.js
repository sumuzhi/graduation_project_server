/*
能操作user-集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const rateSchema = new mongoose.Schema({
  hours: String,
  pv: Number,
  uv: Number
})

// 3. 定义Model(与集合对应, 可以操作集合)
// const rateModel = mongoose.model('buy_10', rateSchema,'buy_10')

// 4. 向外暴露Model
module.exports = mongoose.model('pv_uv_hours', rateSchema, 'pv_uv_hours')
