const users_model = require("../models/users_model")
//得到好友列表
async function getfriendsList(username, number_id) {
  try {
    let aaa = await users_model.findOne({ username, number_id }, { friend_list: 1, friend_list_pre: 1, _id: 0 }).then((data) => {
      return data
    })
    return aaa
  } catch { }
}

//对被申请者的pre列表加入申请者的信息---左侧搜索模块
async function addPreFriendList(username, apply_id, apply_name) {
  try {
    let set_apply = await users_model.updateOne({ username: apply_name, number_id: apply_id }, {
      $push: { friend_list_pre: username }
    }).then((data) => {
      return data
    })
    return set_apply
  } catch { }
}

//对申请者的send列表加入被申请者的信息---左侧搜索模块
async function addSendList(username, number_id, apply_name) {
  try {
    let set_host = await users_model.updateOne({ username, number_id }, {
      $push: { friend_list_send: apply_name }
    }).then((data) => {
      return data
    })
    return set_host
  } catch { }
}

//操作用户申请列表---对接收方(自己)---右侧申请模块
async function updateUserPreList(username, number_id, apply_name) {
  try {
    let aaa = await users_model.updateOne({ username, number_id }, {
      $pull: { friend_list_pre: apply_name }
    }).then((result) => {
      return result
    })
    return aaa
  } catch { }
}

//操作用户申请列表---对发送方也进行操作---右侧申请模块
async function updateUserSendList(username, apply_id, apply_name) {
  try {
    let aaa = await users_model.updateOne({ username: apply_name, number_id: apply_id }, {
      $pull: { friend_list_send: username }
    }).then((result) => {
      return result
    })
    return aaa
  } catch { }
}

//删除好友
async function deleteFriend(host_name, host_id, apply_name, apply_id) {
  try {
    //先删除host中friendList中的appl
    let delete_host = await users_model.updateOne({ username: host_name, number_id: host_id }, {
      $pull: { friend_list: apply_name }
    }).then((result) => {
      console.log(67);
      return result
    })
    //删除apply_name中的host_name
    let delete_apply = await users_model.updateOne({ username: apply_name, number_id: apply_id }, {
      $pull: { friend_list: host_name }
    }).then((result1) => {
      console.log(73);
      return result1
    })
    console.log(76);
    return { delete_host, delete_apply }
  } catch { }
}

module.exports = function (router) {

  //好友列表
  router.post("/friendList", (req, res) => {
    try {
      const {
        username,
        number_id,
      } = req.body
      getfriendsList(username, number_id).then((list) => {
        try {
          list = list["friend_list"]
          users_model.find({ username: { $in: list } }, { username: 1, number_id: 1, userPhoto: 1, signaturePerson: 1, _id: 0 })
            .then((data) => {
              return res.send({ status: 200, data: data })
            })
        } catch { }
      })
    } catch { }
  })

  //搜索好友
  router.post("/searchFriend", (req, res) => {
    const {
      username,
    } = req.body
    users_model.findOne({ username: username }, { username: 1, number_id: 1, userPhoto: 1, signaturePerson: 1, _id: 0 })
      .then((result) => {
        if (result)
          return res.send({ status: 200, data: result })
        else return res.send({ status: 201, msg: "查找的用户不存在" })
      })
  })

  //申请列表
  router.post("/preFriendList", (req, res) => {
    const {
      username,
      number_id
    } = req.body
    console.log(63, req.body);
    // console.log(63, username, number_id);
    try {
      getfriendsList(username, number_id).then((list) => {
        console.log(list);
        list = list["friend_list_pre"]
        users_model.find({ username: { $in: list } }, { username: 1, number_id: 1, userPhoto: 1, signaturePerson: 1, _id: 0 })
          .then((data) => {
            return res.send({ status: 200, data: data })
          })
      })
    } catch { }
  })

  //通过或拒绝申请
  router.post("/bypassApply", (req, res) => {
    const {
      username,//操作者,也就是被申请者
      number_id,
      apply_name,
      apply_id,
      type
    } = req.body
    console.log(type, username, number_id, apply_name, apply_id);
    try {
      //先修改pre_list中的值，后将值加入到friendsList中
      updateUserPreList(username, number_id, apply_name).then((result) => {
        if (result.acknowledged) {
          if (type == 'addFriend') {  //操作如果是添加，则继续操作
            users_model.updateOne({ username, number_id }, {
              $push: { friend_list: apply_name }//将申请者加入到好友列表
            }).then((result1) => {
              if (result1.acknowledged) {
                updateUserSendList(username, apply_id, apply_name).then((result2) => {
                  if (result2.acknowledged) {
                    users_model.updateOne({ username: apply_name, number_id: apply_id }, {
                      $push: { friend_list: username }
                    }).then((result3) => {
                      console.log(result3);
                      if (result3.acknowledged)
                        return res.send({ status: 200, msg: "添加成功" })
                    })
                  }
                })
              }
            })
          } else {
            return res.send({ status: 200, msg: "已拒绝" })
          }
        }
      })
    } catch { }
  })

  //发送添加好友申请 ,需要对两个用户都进行更改
  router.post("/apply_friend", (req, res) => {
    const {
      apply_id,
      username,//要添加的用户
      apply_name,
      number_id
    } = req.body
    console.log(username, apply_id, apply_name, number_id);
    try {
      //先对申请者的信息进行更改,将被申请者的信息放入申请者的friend_list_send中
      addSendList(username, number_id, apply_name).then((result) => {
        if (result.acknowledged) {
          addPreFriendList(username, apply_id, apply_name)
            .then((result) => {
              if (result.acknowledged)
                return res.send({ status: 200, msg: "申请成功" })
            })
        }
      })
    } catch { }
  })

  //删除好友
  router.post("/delete_friend", (req, res) => {
    const {
      host_name,
      host_id,
      apply_name,
      apply_id
    } = req.body
    console.log(host_name, host_id, apply_id, apply_name);
    let state = deleteFriend(host_name, host_id, apply_name, apply_id)
    // console.log(delete_host);
    state.then((result) => {
      const { delete_apply, delete_host } = result
      if (delete_host.acknowledged && delete_apply.acknowledged)
        return res.send({ status: 200, msg: "删除成功" })
      else
        return res.send({ status: 201, msg: "删除失败" })
    })
  })

}