/*
能操作user-集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const rateSchema = new mongoose.Schema({
  // date: String,
  // add_user: Number,
  // day_1: Number,
  // day_1_rate: Number,
  // day_2: Number,
  // day_2_rate: Number,
  // day_3: Number,
  // day_3_rate: Number,
  // day_4: Number,
  // day_4_rate: Number,
  // day_5: Number,
  // day_5_rate: Number,
  // day_6: Number,
  // day_6_rate: Number,
  // day_7: Number,
  // day_7_rate: Number,
  // day_8: Number,
  // day_8_rate: Number
})
// 4.8向外暴露Model
module.exports = mongoose.model('rentention_Model', rateSchema, 'retention')