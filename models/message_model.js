const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const messageSchema = new mongoose.Schema({
  content: { type: String, required: true }, // 发送内容
  sender: { type: String },//发送方id   
  conversation_id: { type: String, require: true },//会话id
  create_time: { type: Number, default: Date.now }
})

// 4. 向外暴露Model
module.exports = mongoose.model('message', messageSchema)