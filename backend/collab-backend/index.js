const io = require('socket.io')(9000, {
    cors : {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
})

console.log(`Collaboration service connected on port 9000`);

io.on("connection", socket => {
    socket.on("send-changes", delta => {
        socket.broadcast.emit("recieve-changes", delta)
    })
    console.log("connected")
})