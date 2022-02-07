const users_model = require("../models/users_model")

async function getfriendsList(username, number_id) {
  try {
    let aaa = await users_model.findOne({ username, number_id }, { friend_list: 1, _id: 0 }).then((data) => {
      return data["friend_list"]
    })
    return aaa
  } catch { }
}

module.exports = function (router) {
  router.post("/friendList", (req, res) => {
    const {
      username,
      number_id,
    } = req.body
    console.log(username);
    getfriendsList(username, number_id).then((list) => {
      users_model.find({ username: { $in: list } }, { username: 1, number_id: 1, userPhoto: 1, _id: 0 })
        .then((data) => {
          return res.send({ status: 200, data: data })
        })
    })
  })

  router.post("/searchFriend", (req, res) => {
    const {
      username,
    } = req.body
    users_model.findOne({ username: username }, { username: 1, number_id: 1, userPhoto: 1, signaturePerson: 1,_id:0 })
      .then((result) => {
        if(result)
       return  res.send({ status: 200, data: result })
       else return res.send({ status: 201,msg:"查找的用户不存在" })
      })
  })
}