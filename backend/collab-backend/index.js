const express = require("express")
const cors = require("cors")
const ip = require('ip');
const ipAddress = ip.address();
const { v4: uuidv4 } = require('uuid');
// const mongoose = require("mongoose")
// const Document = require("./Document")

const PORT = 9000
const defaultDocumentData = ""

// mongoose.connect("mongodb://localhost/document_db")

const app = express()
const server = require("http").createServer(app)
app.use(cors({
    origin: '*',
    methods: ["GET", "POST"],
    optionsSuccessStatus: 200
}))
app.use(express.json())
const io = require("socket.io")(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    }
})
server.listen(PORT, () => {
    console.log(`Collab service connected on port ${PORT}`);
    console.log(`Network access via: ${ipAddress}:${PORT}!`);
});

app.post("/get_room_id", async (req, res) => {
    // User ids are not used. Could have a future use.
    // const {user1, user2} = req.body

    // var room_id = null
    // var document = null

    // do {
    //     room_id = uuidv4()
    //     document = await Document.findById(room_id)
    // } while (document)

    // res.send({ room_id : room_id})

    res.send({ room_id : uuidv4()})
})

// io.on("connection", socket => {
//     socket.on('get-document', async documentID => {
//         // Upon connecting, grab latest copy of document w/ ID, and join channel w/ ID
//         const document = await findOrCreateDocument(documentID)
//         socket.join(documentID)
//         socket.emit("load-document", document.data)

//         // Proprogate changes from users to other users in the same channel
//         socket.on("send-changes", delta => {
//             socket.broadcast.to(documentID).emit("recieve-changes", delta)
//         })
        
//         // Save document into MongoDB
//         socket.on("save-document", async data => {
//             await Document.findByIdAndUpdate(documentID, {data})
//             findOrCreateDocument(documentID)
//         })
//     })
// })

// async function findOrCreateDocument(id) {
//     if (id == null) return
    
//     const document = await Document.findById(id)
//     if (document) return document 
//     return await Document.create({_id: id, data: defaultDocumentData})
    
// }