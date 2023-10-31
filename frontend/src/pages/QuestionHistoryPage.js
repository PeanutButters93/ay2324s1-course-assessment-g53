import { useEffect, useState } from "react"
import axios from "axios"
import useCookie from "../components/useCookie"

const HISTORY_HOST = process.env.REACT_APP_HISTORY_HOST ? process.env.REACT_APP_HISTORY_HOST : "http://localhost:5000/api/history"

const QuestionHistoryPage = () => {
    const [data, setData] = useState("welcome to the qsn history page")
    const {getAuthCookie} = useCookie()

    useEffect(() => {
        const response  = axios.post(HISTORY_HOST, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthCookie()
            }, })
            .then(response => {
                if (response.status === 403) {
                  // Handle the forbidden error
                  return response.then(err => { throw err })
                }
                setData(response.data.document)
              })
            .catch(error => {
                console.error('Error:', error);
                return;
            })

        
    }, [])
    

    return <div>~~ {data} ~~</div>
}

export default QuestionHistoryPage