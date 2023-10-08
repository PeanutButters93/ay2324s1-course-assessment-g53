const io = require('socket.io')(9000, {
    cors : {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
})

io.on("connection", socket => {
    socket.on('get-document', documentID => {
        const data = ""
        socket.join(documentID)
        socket.emit("load-document", data)

        socket.on("send-changes", delta => {
            socket.broadcast.to(documentID).emit("recieve-changes", delta)
        })
    })
    console.log("connected")
})