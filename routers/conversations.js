const conversation_model = require('../models/conversation_model')
const uuid = require("uuid")
module.exports = function (router) {

  router.post("/create_conversation", async (req, res) => {
    const { sender, receiver } = req.body
    const find_conversaion = await conversation_model.find({
      "members": {
        $all: [sender, receiver]
      }
    })
    if (find_conversaion.length !== 0)
      return res.send({ status: 201, find_conversaion })
    try {
      const newConversaion = new conversation_model({
        members: [sender, receiver],
        conversation_id: uuid.v4()
      })
      let aaa = await newConversaion.save()
      return res.send({status:200,data:aaa})
    } catch { }
  })

  router.get("/conversations/:userId", async (req, res) => {
    try {
      let aaaa = conversation_model.find({
        members: { $in: [req.params.userId] }
      })
      aaaa.then((result) => {
        return res.send({ status: 200, data: result })
      })
    } catch (err) {
      res.status(500).json(err)
    }
  })

}