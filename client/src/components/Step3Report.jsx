import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

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

                <button className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl shadow-md transition-all duration-300 font-semibold text-sm sm:text-base text-nowrap ">
                    Download pdf
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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

                <div></div>
            </div >

        </div >
    )
}

export default Step3Report