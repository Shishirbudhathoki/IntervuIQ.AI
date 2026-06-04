import axios from "axios"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { ServerURL } from "../App"
import { useEffect } from "react"
import Step3Report from "../components/Step3Report"

function InterviewReport() {
    const { id } = useParams()
    const [report, setReport] = useState(null)
    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await axios(ServerURL + `/api/interview/report/${id}`, { withCredentials: true })
                console.log(res.data)
                setReport(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchReport();
    }, [id])

    if (!report) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg ">
                    Loading...
                </p>
            </div>
        );
    }
    

    return (
        <Step3Report report={report} />
    )
}

export default InterviewReport