import React, { useRef } from "react";
import { Peer } from "peerjs";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const associateStreamWithVideo = (myVideo, stream) => {
    myVideo.srcObject = stream;
    myVideo.onloadedmetadata = () => {
        myVideo.play();
    };
}

const COMMUNICATION_HOST = proccess.env.REACT_APP_COMMUNICATION_HOST ? proccess.env.REACT_APP_COMMUNICATION_HOST : "http://localhost:9001"

const VideoCall = () => {
  const [myPeer, setMyPeer] = useState(null);
  const [myPeerId, setMyPeerId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [videoElements, setVideoElements] = useState([]);
  const { id: ROOM_ID } = useParams();
  const videoContainerRef = useRef();

  useEffect(() => {
    const peer = new Peer();
    peer.on("open", (id) => {
      console.log(id);
      setMyPeerId(id);
    });
    setMyPeer(peer);
    setSocket(io(COMMUNICATION_HOST));
  }, []);

  useEffect(() => {
    if (!socket) return;
    if (!myPeer || !myPeerId) return;
    const myVideo = document.createElement("video");
    myVideo.muted = true;
    const partnerVideo = document.createElement("video");
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        associateStreamWithVideo(myVideo, stream);
        setVideoElements([myVideo]);
        myPeer.on("call", (call) => {
          call.answer(stream);
          call.once("stream", (partnerStream) => {
            associateStreamWithVideo(partnerVideo, partnerStream)
            setVideoElements([myVideo, partnerVideo]);
          });
          call.on("close", () => {
            partnerVideo.remove()
            setVideoElements([myVideo]);
          });
        });

        socket.on("user-joined", (userId) => {
          const call = myPeer.call(userId, stream);
          call.once("stream", (partnerStream) => {
            console.log(partnerStream);
            associateStreamWithVideo(partnerVideo, partnerStream);
            setVideoElements([myVideo, partnerVideo]);
          });
        });

        socket.emit("hello-server", { id: myPeerId, roomId: ROOM_ID });
      });
  }, [socket, myPeer, myPeerId]);

  useEffect(() => {
    if (videoContainerRef.current == null) return;
    videoContainerRef.current.innerHtml = "";
    for (let videoElem of videoElements) {
      videoElem.style.width = '250px'
      videoElem.style.height = '250px'
      videoElem.style.margin = '10px'
      videoContainerRef.current.appendChild(videoElem);
    }
  }, [videoElements, videoContainerRef]);

  return <div id="videos" ref={videoContainerRef} style={{margin: '10px'}}></div>;
};

export default VideoCall;

