const mongoose = require("mongoose")
const Document = require("./Document")

mongoose.connect("mongodb://localhost/document_db")

const io = require('socket.io')(9000, {
    cors : {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
})

const defaultDocumentData = ""

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
})

async function findOrCreateDocument(id) {
    if (id == null) return
    
    const document = await Document.findById(id)
    if (document) return document 
    return await Document.create({_id: id, data: defaultDocumentData})
    
}