import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Step3Report({ report }) {
    if (!report) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg ">
                    Loading Report...
                </p>
            </div>
        );
    }

    const navigate = useNavigate();
    const {
        finalScore,
        confidence,
        communication,
        correctness,
        questionWiseScore = [],
    } = report;

    const questionScoreData = questionWiseScore.map((score, index) => ({
        name: `Q${index + 1}`,
        score: score.score || 0,
    }));

    const skills = [
        { label: "Confidence", value: confidence },
        { label: "Communication", value: communication },
        { label: "Correctness", value: correctness },
    ]

    let performanceLevel = "";
    let shortTagLine = "";

    if (finalScore >= 8) {
        performanceLevel = "Ready for job opportunities";
        shortTagLine = "Excellent clarity and structured responses.";
    } else if (finalScore >= 5) {
        performanceLevel = "Need minor improvement before interviews.";
        shortTagLine = "Good foundation, refine articulation";
    } else {
        performanceLevel = "Significant improvement required.";
        shortTagLine = "Work on clarity and confidence.";
    }

    const score = finalScore;
    const percentage = (score / 10) * 100;

    const downloadPDF = () => {
        const doc = new jsPDF("p", "mm", "a4");

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;

        let currentY = 25;

        //  =========TITLE========

        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(34, 197, 94);
        doc.text("AI Interview Performance Report", pageWidth / 2, currentY, { align: "center" });

        currentY += 5;

        // underLine
        doc.setDrawColor(34, 197, 94);
        doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
        currentY += 15;

        // ========FINAL SCORE BOX========
        doc.setFillColor(240, 253, 244);
        doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");
        doc.setFontSize(14);
        doc.setTextColor(0,0,0);
        doc.text(`Final Score: ${finalScore}/10`, pageWidth / 2, currentY + 12, { align: "center" });

        currentY += 30;

        // ========SKILLS BOX========
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");
        doc.setFontSize(12);

        doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
        doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
        doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);

        currentY += 45;

        // ========ADVICE========
        let advice = "";
        if (finalScore >= 8) {
            advice = "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
        } else if (finalScore >= 5) {
            advice = "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
        } else {
            advice = "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";
        }

        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(220);
        doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4, "F");
        doc.setFont("helvetica", "bold");
        doc.text("Professional Advice:", margin + 10, currentY + 10);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
        doc.text(splitAdvice, margin + 10, currentY + 20);

        currentY += 50;

        // ========QUESTION TABLE========
        autoTable(doc, {
            startY: currentY,
            margin: { left: margin, right: margin },
            head: [["#", 'Question', 'Score', "Feedback"]],
            body: questionWiseScore.map((q, i) => [
                `${i + 1}`,
                q.question,
                `${q.score}/10`,
                q.feedback,
            ]),
            styles: { fontSize: 9, cellPadding: 5, valign: "top" },
            headStyles: { fillColor: [34, 197, 94], textColor: 255, halign: "center" },
            columnStyles: {
                0: { cellWidth: 10, halign: "center" },
                1: { cellWidth: 55 },
                2: { cellWidth: 20, halign: "center" },
                3: { cellWidth: "auto" },
            },
            alternateRowStyles: { fillColor: [249, 250, 251] },
        });

        doc.save("AI_Interview_Report.pdf");
    };

    return (
        <div className="min-h-screen bg-linear-to-r from-gray-50 to-green-50 px-4 sm:px-6 lg:px-10 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="md:mb-5 w-full flex items-start gap-4 flex-wrap">
                    <button
                        onClick={() => navigate('/history')}
                        className="mt-1 p-3 rounded-full bg-white shadow hover:shadow-md" >
                        <FaArrowLeft className="text-gray-600" />
                    </button>

                    <div>
                        <h1 className="text-3xl font-bold flex-nowrap text-gray-800">
                            Interview Analytics Dashboard
                        </h1>
                        <p className="text-gray-500 mt-2">
                            AI-powered performance insights
                        </p>
                    </div>
                </div>

                <button onClick={downloadPDF} className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl shadow-md transition-all duration-300 font-semibold text-sm sm:text-base text-nowrap ">
                    Download pdf
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-5 md:mt-0">
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-3 sm:p-4 text-center"
                    >
                        <h3 className="text-gray-500 mb-2 sm:mb-3 text-sm sm:text-base">
                            Overall Performance
                        </h3>
                        <div className="relative w-16 h-16 sm:w-18 sm:h-18 mx-auto">
                            <CircularProgressbar value={percentage} text={`${score}/10`}
                                styles={buildStyles({
                                    textSize: '28px',
                                    pathColor: "#10b981",
                                    textColor: '#ef4444',
                                    trailColor: '#e5e7eb',
                                })}
                            />
                        </div>

                        <p className="text-gray-400 mt-1 text-xs sm:text-sm">
                            Out of 10
                        </p>

                        <div className="mt-2">
                            <p className="text-gray-800 font-semibold text-sm sm:text-base">
                                {performanceLevel}
                            </p>

                            <p className="text-gray-500 mt-1 text-xs sm:text-sm">
                                {shortTagLine}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6"
                    >
                        <h3 className="text-gray-700 mb-3  text-base sm:text-lg font-semibold">
                            Skill Evaluation
                        </h3>

                        <div className="space-y-5">
                            {skills.map((skill, index) => (
                                <div key={index}>
                                    <div className="flex justify-between mb-1 text-sm sm:text-base">
                                        <span className="text-gray-600">{skill.label}</span>
                                        <span className="font-semibold text-green-600">{skill.value}
                                        </span>
                                    </div>


                                    <div className="bg-gray-200 rounded-full h-1  lg:h-2">
                                        <div className="bg-green-500 h-full rounded-full"
                                            style={{ width: `${skill.value * 10}%` }}
                                        >
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-5">
                        <h3 className="text-gray-700 text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                            Performance Trend
                        </h3>
                        <div className="h-64 sm:h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={questionScoreData} >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[0, 10]} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="score" stroke="#22c55e" fill="#bbf7d0" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-5">
                        <h3 className="text-gray-700 text-base sm:text-lg font-semibold mb-6">
                            Question Breakdown
                        </h3>
                        <div className="space-y-4">
                            {questionWiseScore.map((q, index) => (
                                <div key={index} className="bg-gray-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-3 sm:items-start">
                                        <div>
                                            <p className="text-gray-400 text-xs ">
                                                Question {index + 1}
                                            </p>

                                            <p className="text-gray-800 font-semibold text-sm sm:text-base leading-relaxed">
                                                {q.question || "Question not available"}
                                            </p>
                                        </div>

                                        <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full font-bold text-xs sm:text-sm w-fit">
                                            {q.score ?? 0}/10
                                        </div>

                                    </div>

                                    <div className="bg-green-50 border-green-200 p-4 rounded-lg">
                                        <p className="text-green-600 text-xs text-semibold mb-1">
                                            AI Feedback
                                        </p>

                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            {q.feedback && q.feedback.trim() !== "" ? q.feedback : "No feedback available for this question."}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

            </div >

        </div >
    )
}

export default Step3Report