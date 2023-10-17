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
        console.log("peer opened")
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
        addVideoStream(personalVideo, stream);
        socket.emit("video-ready", {"ping" : "pong"}); 
        //this is to allow any person who calls me to get my video stream, and for me to get theirs
        peer.on("call", (call) => {
          console.log("Sending stream back to other guy");
          call.answer(stream);
          call.on("stream", (userVideoStream) => {
            addVideoStream(null, userVideoStream);
          });
        });
        //Server will emit this to the room, this is to allow for new user connected, I call the new user

        socket.on("user-connected", (userId) => {
            if (userId === peerId) return
          console.log("Trying to connect to: ", userId);
          connectToNewUser(userId, stream);
        });
      });
  }, [peerId]);


  function connectToNewUser(userId, stream) {
    //when I am calling this user, I send over my stream
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    // I then also expect a stream in return which I would then use to add to my display
    call.on("stream", (userVideoStream) => {
      console.log("hi")
      addVideoStream(video, userVideoStream);
    });
    //when the call is closed then I will remove the video stream
    call.on("close", () => {
      video.remove();
    });

    peers[userId] = call;
  }

  function addVideoStream(video, stream) {
    if (video !== null) {
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
      setVideoElements((prevVideoElements) => [...prevVideoElements, video]);
      return;
    }
    const newVideo = document.createElement("video");
    newVideo.srcObject = stream;
    newVideo.addEventListener("loadedmetadata", () => {
      newVideo.play();
    });
    setVideoElements((prevVideoElements) => [...prevVideoElements, newVideo]);
  }


  const wrapperRef = useCallback(
    (wrapper) => {
      if (wrapper == null) {
        return;
      }

      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      const textNode = document.createTextNode("Hello world");
      editor.appendChild(textNode);

      videoElements.forEach((video) => editor.appendChild(video));
      console.log(videoElements);
      wrapper.append(editor);
    },
    [videoElements]
  );

  return <div id="video" ref={wrapperRef}></div>;
};

export default VideoCall;
