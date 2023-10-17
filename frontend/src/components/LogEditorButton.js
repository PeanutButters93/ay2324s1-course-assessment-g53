import React, { useState } from 'react';
import { useParams } from "react-router-dom"
import axios from 'axios';

function LogEditorButton() {
  const {id: roomId} = useParams()

  const handleButtonClick = async () => {
    console.log(await get_document());
  };

  const COLLAB_HOST = process.env.REACT_APP_COLLAB_HOST ? process.env.REACT_APP_COLLAB_HOST : "http://localhost:9000"

  async function get_document() {
    return axios.post(COLLAB_HOST + "/get_document_raw", {
      documentID: roomId,
    }, {headers: {
      "Content-Type": "application/json",
    }})
      .then((response) => {
        const {document} = response.data
        return document
      })
      .catch(error => {
        console.error('Error:', error);
        throw error;
      })
  }

  return (
    <div>
      <button onClick={handleButtonClick}>Click to log editor into console</button>
    </div>
  );
}

export default LogEditorButton;