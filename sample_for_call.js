const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)
    //this is to allow any person who calls me to get my video stream, and for me to get theirs
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })
  //Server will emit this to the room, this is to allow for new user connected, I call the new user
  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
    //tell server to join the room
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
    //when I am calling this user, I send over my stream
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  // I then also expect a stream in return which I would then use to add to my display
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  //when the call is closed then I will remove the video stream
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}