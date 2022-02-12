const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const chatSchema = new mongoose.Schema({
  content: { type: String, required: true }, // 发送内容
  sender: { type: String },//发送方id   
  conversation_id: { type: String, require: true },//会话id
  read: { type: Boolean, required: true, default: false }, // 是否已读
  create_time: { type: Number, default: Date.now }
})
// username password userPhoto number_id signaturePerson
// 3. 定义Model(与集合对应, 可以操作集合)
const ChatsModel = mongoose.model('chats', chatSchema)

// 4. 向外暴露Model
module.exports = ChatsModel