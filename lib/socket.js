let io;

const initSocket = (serverIo) => {
  io = serverIo;
};

const emitNotification = (userId) => {
  if (io) {
    io.to(userId).emit("new-notification");
  }
};

module.exports = { initSocket, emitNotification };
