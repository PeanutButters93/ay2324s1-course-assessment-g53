const { Schema, model } = require("mongoose")
 const roomSchema = new Schema({
     _id: String,
     question: Object
 })

 module.exports = model("roomSchema", roomSchema)