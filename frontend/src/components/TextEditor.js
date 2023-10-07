import { useCallback, useEffect, useRef, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from "socket.io-client"

function TextEditor() {
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()
    
  /**
   * Connect to Collab Service in backend upon page start
   */
  useEffect(() => {
    const s = io("http://localhost:3001")
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])
  
  /**
   * Send user made changes to the server
   */
  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return
      socket.emit("send-changes", delta)
    }

    quill.on('text-change', handler)

    return () => {
      quill.off('text-change', handler)
    }
  }, [socket, quill])
  
  
  /**
   * Recieve changes
   */
  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta) => {
      quill.updateContents(delta)
    }

    socket.on('recieve-changes', handler)

    return () => {
      socket.off('recieve-changes', handler)
    }
  }, [socket, quill])

  /**
   * Create Quill instance
   */
  const wrapperRef = useCallback((wrapper) => {
      if (wrapper == null) return

      wrapper.innerHTML = ""
      const editor = document.createElement('div')
      wrapper.append(editor)
      const q = new Quill(editor, {theme : "snow"})
      setQuill(q)
  }, [])

  return (
    <div id = "container" ref = {wrapperRef}></div>
  )
}

export default TextEditor
