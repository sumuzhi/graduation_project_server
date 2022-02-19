const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const filesSchema = new mongoose.Schema({
  content: { type: String, required: true, default: "file" },
  fieldname: { type: String },//文件名
  file_id: { type: String },
  file_buffer: { type: Buffer, required: false },//文件的buffer
  mimeType: { type: String, required: true },
  encoding: { type: String, required: true },
  isFile: { type: Boolean, default: true },
  sender: { type: String },//发送方id   
  conversation_id: { type: String, require: true },//会话id
  size: { type: String},//文件大小
  create_time: { type: Number, default: Date.now },
})

// 4. 向外暴露Model
module.exports = mongoose.model('files', filesSchema)