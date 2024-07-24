const tournamentMatch = {
}

module.exports = async (socketIo) => {
  const namespace = socketIo.of(/^\/TR-.*$/)
  namespace.on("connection", async function (socket) {
    const tournamentId = socket.nsp.name.slice(4)
    console.log(tournamentId)
    console.log("Connected: ", socket.id)
    // const { userName } = socket.handshake.query
    // socket['data'] = { userName }
  })
}