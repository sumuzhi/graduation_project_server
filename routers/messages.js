const message_model = require('../models/message_model')

module.exports = function (router) {

  router.post("/create_messages", async (req, res) => {
    // console.log(req.body);
    const newMessage = new message_model(req.body)
    try {
      let aaa = await newMessage.save()
      res.status(200).json(aaa)
    } catch { }
  })

  router.get("/messages/:conversationId", async (req, res) => {
    console.log(15, req.params);
    try {
      let aaa = await message_model.find({
        conversation_id: req.params.conversationId
      })
      res.status(200).json(aaa)
    } catch { }
  })

}