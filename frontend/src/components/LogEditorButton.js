import React, { useState } from 'react'
import { useParams } from "react-router-dom"
import axios from 'axios'

function LogEditorButton () {
  const { id: roomId } = useParams()
  const [output, setOutput] = useState(null)

  const handleButtonClick = async () => {
    console.log(await get_document())
  }

  // Event handler for the submit button
  const handleSubmit = async () => {
    const code = await get_document()
    console.log(code)
    const cleanedCode = code.replace(/[\u00A0]/g, '  ')

    // Create the payload to send to the API
    const payload = {
      language: 'py3',
      version: '3.10.0',
      files: [
        {
          name: 'my_cool_code.py',
          content: cleanedCode,
        },
      ],
      stdin: '',
      args: ['1', '2', '3'],
      compile_timeout: 10000,
      run_timeout: 3000,
      compile_memory_limit: -1,
      run_memory_limit: -1,
    }

    // Make the POST request to the API
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    // Handle the response (you may want to do error checking here)
    const responseData = await response.json()
    setOutput(responseData)
  }

  const COLLAB_HOST = process.env.REACT_APP_COLLAB_HOST ? process.env.REACT_APP_COLLAB_HOST : "http://localhost:9000"

  async function get_document () {
    return axios.post(COLLAB_HOST + "/get_document_raw", {
      documentID: roomId,
    }, {
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((response) => {
        const { document } = response.data
        return document
      })
      .catch(error => {
        console.error('Error:', error)
        throw error
      })
  }

  return (
    <div>
      <button onClick={handleSubmit}>Submit Code</button>
      <div>
        <h2>API Response:</h2>
        <div style={{ width: "100%", height: "100%", overflowY: "scroll", border: "1px solid #ccc", padding: "10px", maxHeight: "300px", maxWidth: "800px" }}>
          {output?.run?.stderr ? (
            <div>
              <h2>Error Output:</h2>
              <pre>{output.run.stderr}</pre>
            </div>
          ) : (
            <div>
              <h2>Standard Output:</h2>
              <pre>{output?.run?.stdout}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
    // <div>
    //   <h2>API Response:</h2>
    //   <div> {JSON.stringify(output)} </div>
    // </div>
  )
}

export default LogEditorButton