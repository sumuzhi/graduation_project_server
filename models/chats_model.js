const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const chatSchema = new mongoose.Schema({
  content: { type: String, required: true }, // 发送内容
  read: { type: Boolean, required: true, default: false }, // 是否已读
  send_id: { type: String, required: true }, // 发送方id
  receive_id: { type: String, required: true },  //  接收方id
  create_time: { type: Number, default: Date.now }
})
// username password userPhoto number_id signaturePerson
// 3. 定义Model(与集合对应, 可以操作集合)
const ChatsModel = mongoose.model('chats', chatSchema)

// 4. 向外暴露Model
module.exports = ChatsModel