const multer = require('multer')
const message_model = require('../models/message_model')
const storage = multer.memoryStorage()
const upload = multer({ storage })
const uploadSingle = upload.any()

module.exports = function (router) {
  router.post("/message_recorder", async (req, res) => {
    uploadSingle(req, res, function (err) {
      try {
        const recorder = req.files[0].buffer
        // console.log(req.body);
        // console.log(voice);
        const data = { recorder, ...req.body }
        console.log(data);
        if (req.body.isRecorder === 'true') {
          console.log("coming in");
          const news = new message_model(data)
          news.save((err,result) => {
            if (!err)
              res.status(200).json(result)
          })
        }
      } catch {
        res.send({ status: 202, msg: "检测到不合法的数据请求" })
      }
    })
  })
}