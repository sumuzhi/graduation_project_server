

module.exports = function (server) {
  const io = require("socket.io")(server)
  io.on('connection', function (socket) {
    socket.on('sendMsg', function (data) {
      console.log(data);
      io.emit('receiveMsg', data)
    })
  })
}