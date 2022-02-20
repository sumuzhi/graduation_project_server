const md5 = require('blueimp-md5')
const svgCaptcha = require('svg-captcha');
const users_model = require("../models/users_model")

var codeAns = '';  //! 服务器生成的code


// 生成合适大小的验证码图片代码
function createVerifyImg() {
  var captcha = svgCaptcha.create({
    noise: 0,
    width: 90,
    height: 30,
    fontSize: 35,
  });
  codeAns = captcha.text
  console.log(codeAns);
  return captcha
}
module.exports = function (router) {
  //登录路由
  router.get('/captcha', (req, res) => {
    captcha = createVerifyImg()
    res.type('svg');
    res.status(200).send(captcha.data);
  });

  router.post('/login', (req, res) => {
    const {
      username,
      password,
      code
    } = req.body
    console.log("servier receice name:", username);

    try {
      if (code.toLowerCase() !== codeAns.toLowerCase())
        return res.send({ status: 201, msg: "验证码错误" })

      users_model.findOne({
        username: username
      }).then(state => {
        if (state) {
          users_model.findOne({ username: username, password: md5(password) })
            .then((state) => {
              if (state) {
                let userInfo = {
                  username: state.username,
                  number_id: state.number_id,
                  userPhotoBase64: state.userPhoto,
                  signaturePerson: state.signaturePerson
                }
                res.send({ status: 200, msg: "登录成功", data: userInfo })
                // 调用friends表的方法，将注册的用户生成相应的friend
              }
              else
                res.send({ status: 201, msg: "用户名或密码错误" })
            })
        } else {
          res.send({ status: 201, msg: "该用户未注册，请前往注册页面" })
        }
      })
      createVerifyImg()
    } catch { }
  })

}