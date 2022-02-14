let users = []
const message_model = require('../models/message_model')

const addUser = ({ user_id, socket_id }) => {
  !users.some((user) => { user.user_id === user_id }) &&
    users.push({ user_id, socket_id })
}

const removeUser = (socket_id) => {
  users = users.filter((user) => user.socket_id !== socket_id)
}

module.exports = function (server) {

  const io = require("socket.io")(server)
  io.on('connection', function (socket) {

    const user = { socket_id: socket.id, user_id: socket.handshake.query.id }
    addUser(user)
    console.log("+++++++++++");
    console.log(users);

    io.emit("getSocketId", { user })
    io.emit("totaluser", users)


    socket.on("sendMessage", (data) => {
      console.log(27, data);
      const { receiver } = data
      let user = users.filter(c => c.user_id == receiver)
      try {
        console.log(31, user[0].socket_id);
        io.to(user[0].socket_id).emit("receiveMessage", data)
      } catch { }
    })


    socket.on("disconnect", (aaa) => {
      console.log("disconnect");
      console.log("---------");
      removeUser(socket.id) 
      console.log(users);
    })
  })

} 