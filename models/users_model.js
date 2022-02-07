const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true }, //~ 用户名
  password: { type: String, required: true }, // 密码
  userPhoto: { type: String, required: true }, // 头像，base64存储在数据库中
  number_id: { type: String, required: true },  //类似于qq号，分配的
  signaturePerson: { type: String }, // 个性签名
  friend_list: [], // 好友列表
  friend_list_pre: [], // 申请好友列表
  create_time: { type: Number, default: Date.now }
})
// username password userPhoto number_id signaturePerson
// 3. 定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('usersInfo', userSchema)

// 4. 向外暴露Model
module.exports = UserModel