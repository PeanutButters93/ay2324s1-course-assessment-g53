import React from "react";
import { io } from "socket.io-client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Peer } from "peerjs";


const VideoCall = () => {
  const [peers, setPeers] = useState({});
  const [socket, setSocket] = useState(null);
  const [videoElements, setVideoElements] = useState([]);
  const { id: ROOM_ID } = useParams();
  const [peer, setPeer] = useState(new Peer());
  const [peerId, setPeerId] = useState(null)

  useEffect(() => {
    const s = io("http://localhost:9001");
    //connect to the server
    setSocket(s);
    
    peer.on("open", (id) => {
      s.emit("join-room", ROOM_ID, id , () => {
        setPeerId(id)
      });
      //socket emits the intention to join a room, lets the server handle it
    });

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("room, ", peerId)
    if (!peerId) return

    const personalVideo = document.createElement("video");
    personalVideo.muted = true;
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        if (videoElements.length == 0) {
        console.log("Adding personal video")
        addVideoStream(personalVideo, stream, "personal");
        }
        socket.emit("video-ready", {"ping" : "pong"}); 
        //this is to allow any person who calls me to get my video stream, and for me to get theirs
        peer.on("call", (call, otherStream) => {
          console.log("Sending stream back to other guy");
          call.answer(stream);
        //   call.on("stream", (userVideoStream) => {
        //     addVideoStream(null, userVideoStream);
        //   });
        console.log("otherStream: ", otherStream)
        if (otherStream === undefined) return
        const video = document.createElement("video")
        // console.log("adding other guy video")
         addVideoStream(video, otherStream, "Other")
        });
        //Server will emit this to the room, this is to allow for new user connected, I call the new user

        socket.on("user-connected", (userId) => {
            if (userId === peerId) return
            console.log("calling the other guy")
          connectToNewUser(userId, stream);
        });

        socket.on('user-disconnected', userId => {
            if (peers[userId]){
                peers[userId].close()
            } 
            
          })
      });
  }, [peerId]);


  function connectToNewUser(userId, stream) {
    //when I am calling this user, I send over my stream
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    
    // I then also expect a stream in return which I would then use to add to my display
    call.once("stream", (userVideoStream) => {
      console.log("hi")
      addVideoStream(video, userVideoStream, "Other person");
    });
    //when the call is closed then I will remove the video stream
    call.on("close", () => {
      video.remove();
    });

    peers[userId] = call;
  }

  function addVideoStream(video, stream, whose) {
      console.log(whose)
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
      setVideoElements((prevVideoElements) => [...prevVideoElements, video]);
      return;
  }


  const wrapperRef = useCallback(
    (wrapper) => {
      if (wrapper == null) {
        return;
      }

      wrapper.innerHTML = "";
      const editor = document.createElement("div");
    //   const textNode = document.createTextNode("Hello world");
    //   editor.appendChild(textNode);

      videoElements.forEach((video) => {
        video.style.width = '250px'
        video.style.height = '250px'
        video.style.margin = '10px'
        editor.appendChild(video)});
      console.log(videoElements);
      wrapper.append(editor);
    },
    [videoElements]
  );

  return <div id="video" ref={wrapperRef} style={{ width: '750px', backgroundColor: 'white'}}>
  </div>;
};

export default VideoCall;
