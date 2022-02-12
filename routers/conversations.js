const conversation_model = require('../models/conversation_model')
const uuid = require("uuid")
module.exports = function (router) {

  router.post("/create_conversation", async (req, res) => {
    console.log(req.body)
    const newConversaion = new conversation_model({
      members: [req.body.senderId, req.body.receiverId],
      conversation_id: uuid.v4()
    })
    try {
      let aaa = await newConversaion.save()
      res.status(200).json(aaa)
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