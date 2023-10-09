const mongoose = require("mongoose")
const Document = require("./Document")

mongoose.connect("mongodb://localhost/document_db")

const io = require('socket.io')(9000, {
    cors : {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
})

const defaultValue = ""

io.on("connection", socket => {
    socket.on('get-document', async documentID => {
        const document = await findOrCreateDocument(documentID)
        socket.join(documentID)
        socket.emit("load-document", document.data)

        socket.on("send-changes", delta => {
            socket.broadcast.to(documentID).emit("recieve-changes", delta)
        })

        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentID, {data})
            findOrCreateDocument(documentID)
        })
    })
})

async function findOrCreateDocument(id) {
    if (id == null) return
    
    const document = await Document.findById(id)
    if (document) return document 
    return await Document.create({_id: id, data: defaultValue})
    
}