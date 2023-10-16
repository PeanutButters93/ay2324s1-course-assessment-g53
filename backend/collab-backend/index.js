const express = require("express")
const cors = require("cors")
const { v4: uuidv4 } = require('uuid');
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Document = require("./Document")

dotenv.config({
    path: ".env.local"
})
const DEFAULT_DOCUMENT_DATA = ""
const PORT = process.env.PORT ? process.env.PORT : 9000
const FRONTEND_HOST = process.env.FRONTEND_HOST ? process.env.FRONTEND_HOST : "http://localhost:3000"

mongoose.connect(process.env.MONGODB_URI)

const app = express()
const server = require("http").createServer(app)
app.use(cors())
app.use(express.json())
const io = require("socket.io")(server, {
    cors: {
      origin: FRONTEND_HOST,
      methods: ["GET", "POST"]
    }
})
server.listen(PORT, () => {
    console.log(`Collab service connected on port ${PORT}`);
});

app.post("/get_room_id", async (req, res) => {
    // User ids are not used. Could have a future use.
    const {user1, user2} = req.body

    var room_id = null
    var document = null

    do {
        room_id = uuidv4()
        document = await Document.findById(room_id)
    } while (document)

    res.send({ room_id : room_id})
})

io.on("connection", socket => {
    socket.on('get-document', async documentID => {
        // Upon connecting, grab latest copy of document w/ ID, and join channel w/ ID
        const document = await findOrCreateDocument(documentID)
        socket.join(documentID)
        socket.emit("load-document", document.data)

        // Proprogate changes from users to other users in the same channel
        socket.on("send-changes", delta => {
            socket.broadcast.to(documentID).emit("recieve-changes", delta)
        })
        
        // Save document into MongoDB
        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentID, {data})
            findOrCreateDocument(documentID)
        })
    })
//socket for the video calling
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
    
        socket.on('disconnect', () => {
          socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
      })
    
})

async function findOrCreateDocument(id) {
    if (id == null) return
    
    const document = await Document.findById(id)
    if (document) return document 
    return await Document.create({_id: id, data: DEFAULT_DOCUMENT_DATA})
}