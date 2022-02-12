const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const conversationSchema = new mongoose.Schema({
  members: { type: Array },  //对话成员的id数组
  create_time: { type: Number, default: Date.now },
  conversation_id: { type: String }
})

// 4. 向外暴露Model
module.exports = mongoose.model('conversation', conversationSchema)