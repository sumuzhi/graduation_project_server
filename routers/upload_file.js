const multer = require('multer')
const uuid = require("uuid")
const storage = multer.memoryStorage()
const upload = multer({ storage })
const uploadSingle = upload.any()

const files_model = require("../models/files_model")

module.exports = function (router) {

  //上传文件
  router.post("/upload_file", (req, res) => {
    uploadSingle(req, res, async function (err) { //错误处理
      const {
        sender,
        conversation_id,
      } = req.body
      console.log(sender, conversation_id);
      // return res.status(200).json({ a: 1 })
      const file_id = uuid.v4()
      const { fieldname, encoding, mimetype, buffer, size } = req.files[0];
      const data = { size, file_id, fieldname, file_buffer: buffer, mimeType: mimetype, encoding, sender, conversation_id }
      let aaa = new files_model(data)
      let bbb = await aaa.save()
      const { content, create_time } = bbb
      if (bbb.file_buffer !== '') {
        return res.send({ status: 200, file_id, create_time, content, fieldname, sender, conversation_id })
      }
    })
  })

  //得到文件列表
  router.get("/get_file_list", async (req, res) => {
    const {
      conversation_id
    } = req.query
    console.log(conversation_id);
    let result = await files_model.find({ conversation_id }, { file_buffer: 0 })
    const { fieldname, file_id, sender, isFile, size } = result
    // const datass = { fieldname, file_id, sender, isFile, conversation_id, size }
    return res.send({ status: 200, result })
  })

  //下载文件
  router.post("/download_file", async (req, res) => {
    const {
      conversation_id,
      file_id
    } = req.body
    try {
      let result = await files_model.findOne({ conversation_id, file_id })
      return res.send({ status: 200, data: result })
    } catch { }
  })
}
