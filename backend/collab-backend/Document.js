const { Schema, model } = require("mongoose")
const Document = new Schema({
    _id: String,
    data: Object
}, {timestamps : true})

Document.index({ updatedAt: 1 }, { expireAfterSeconds: 90 });
module.exports = model("Document", Document)