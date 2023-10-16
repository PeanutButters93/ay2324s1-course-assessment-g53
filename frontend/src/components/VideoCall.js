import React from "react";
import { io } from "socket.io-client";
import { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import useCookie from "../components/useCookie";
import {Peer} from "peerjs"


const VideoCall = () => {
    const peer = new Peer("zz")
    const [socket, setSocket] = useState(null)
    const {id: callId} = useParams()
    console.log(callId)

    useEffect(() => {
        const s = io("http://localhost:9000")
        //connect to the server
        setSocket(s)
    
        return () => {
          s.disconnect()
        }
      }, [])
    
    return (<div>Here is the video call</div>)

}

export default VideoCall;