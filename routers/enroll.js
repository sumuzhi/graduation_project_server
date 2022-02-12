const random = require("string-random") //用来生成qq号
const multer = require('multer')
const md5 = require('blueimp-md5')
const uuid = require('uuid')
const users_model = require("../models/users_model")
const storage = multer.memoryStorage()
const upload = multer({ storage })
const uploadSingle = upload.any()

// todo 生成随机数字串，第一位不为0
function getNumber() {
  let number_id = random(8, { letters: false })
  while (number_id[0] == '0') {
    number_id = random(8, { letters: false })
  }
  return number_id
}

module.exports = function (router) {

  router.post("/enroll", (req, res) => {
    uploadSingle(req, res, function (err) {
      const {
        username,
        password,
        signaturePerson
      } = req.body
      try {
        const userPhotoImg = req.files[0].buffer
        const Imgbase64 = userPhotoImg.toString("base64")
        const userPhohobase64 = "data:image/jpeg;base64," + Imgbase64
        numberid = getNumber()
        users_model.findOne({ username })
          .then((state) => {
            if (state) {
              return res.send({ status: 201, msg: "该用户已被注册，请前往登录" })
            } else {
              users_model.create({
                username: username,
                password: md5(password),
                number_id: numberid,
                signaturePerson: signaturePerson,
                userPhoto: userPhohobase64,
              }).then((state) => {
                if (state) {
                  return res.send({ status: 200, msg: "创建用户成功" })
                } else {
                  return res.send({ status: 201, msg: "创建用户失败" })
                }
              })
            }
          })
      } catch {
        res.send({ status: 202, msg: "检测到不合法的数据请求" })
      }
    })
  })

}