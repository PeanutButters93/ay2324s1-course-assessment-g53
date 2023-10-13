const { v4: uuidv4 } = require('uuid');

export async function get_room_id(req, res) {
  try {
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
  } catch (error) {
    console.log(error);
    res.status(400).send("ERROR");
  }
}