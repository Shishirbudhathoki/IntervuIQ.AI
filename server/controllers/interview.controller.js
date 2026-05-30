import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { askAi } from '../services/openRouter.services.js';
import User from '../models/user.model.js';
import Interview from '../models/interview.model.js';

export const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Resume required' });
        }
        const filepath = req.file.path;
        const filebuffer = await fs.promises.readFile(filepath);
        const uint8Array = new Uint8Array(filebuffer);
        // const pdf = await pdfjsLib.getDocument(uint8Array).promise;
        const loadingTask = pdfjsLib.getDocument({
            data: uint8Array,
            standardFontDataUrl: './node_modules/pdfjs-dist/standard_fonts/',
        });
        const pdf = await loadingTask.promise;

        let resumeText = '';
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(' ');
            resumeText += pageText + "\n";
        }
        resumeText = resumeText.replace(/\s+/g, ' ').trim();
        const messages = [
            {
                role: "system",
                content: `
                Extract structured data from resume.

                Return ONLY valid JSON.
                Do not include markdown.
                Do not include \`\`\`json.

                Format:

                {
                 "role": "string",
                 "experience": "string",
                 "projects": ["project1","project2"],
                 "skills": ["skill1","skill2"]
                }
                `
            },
            {
                role: "user",
                content: resumeText
            }
        ];

        const aiResponse = await askAi(messages);

        let parsed;
        try {
            parsed = JSON.parse(aiResponse);
        } catch (parseErr) {
            console.error('Failed to parse AI response as JSON:', aiResponse);
            if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
            return res.status(500).json({ message: 'AI returned invalid JSON' });
        }

        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);

        res.json({
            role: parsed.role,
            experience: parsed.experience,
            projects: parsed.projects,
            skills: parsed.skills,
            resumeText
        })
    } catch (error) {
        console.log(error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: error.message });
    }
}

export const generateQuestions = async (req, res) => {
    try {
        let { role, experience, mode, resumeText, projects, skills } = req.body;
        if (!role || !experience || !mode) {
            return res.status(400).json({ message: 'Role, experience and mode are required' });
        }
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.credits < 50) {
            return res.status(400).json({ message: 'Not enough credits : Minimum 50 required' });
        }
        const projectText = Array.isArray(projects) && projects.length ? projects.join(", ") : "None";

        const skillsText = Array.isArray(skills) && skills.length ? skills.join(", ") : "None";

        const safeResume = resumeText?.trim() || "No resume text provided";

        const userPrompt = `
        Role: ${role}
        Experience: ${experience}
        InterviewMode: ${mode}
        Projects: ${projectText}
        Skills: ${skillsText}
        Resume: ${safeResume}
        `;

        if (!userPrompt.trim()) {
            return res.status(400).json({ message: 'Insufficient information to generate questions' });
        }

        const messages = [
            {
                role: "system",
                content: `
                You are a real human interviewer conducting a professional interview.

                Speak in simple, natural English as if you are directly talking to the candidate.

                Generate exactly 5 interview questions.

                Strict Rules:
                - Each question must conatin between 15 and 25 words.
                - Each question must be a single complete sentence.
                - Do NOT number them.
                - Do NOT add extra explanations.
                - Do NOT add extra text before or after.
                - One question per line only.
                - Keep language simple and conversational.
                -Questions must feel practical and realistic.
                
                Difficulty progression:
                Question 1 → easy  
                Question 2 → easy  
                Question 3 → medium  
                Question 4 → medium  
                Question 5 → hard 

                Make questions based on the candidate’s role, experience,interviewMode, projects, skills, and resume details
                `
            },
            {
                role: "user",
                content: userPrompt
            }
        ];


        const aiResponse = await askAi(messages);
        if (!aiResponse || !aiResponse.trim()) {
            return res.status(500).json({ message: 'AI returned empty response' });
        }

        const questionArray = aiResponse
            .split('\n')
            .map(q => q.trim())
            .filter(q => q.length > 0)
            .slice(0, 5);

        if (questionArray.length === 0) {
            return res.status(500).json({ message: 'AI failed to generate questions.' });
        }

        // Create interview first, then deduct credits to avoid charging on DB failures.
        const interview = await Interview.create({
            userId: user._id,
            role,
            experience,
            mode,
            resumeText: safeResume,
            questions: questionArray.map((q, index) => ({
                question: q,
                difficulty: ["easy", "easy", "medium", "medium", "hard"][index],
                timeLimit: [60, 60, 90, 90, 120][index],
            }))
        });

        try {
            user.credits -= 50;
            await user.save();
        } catch (creditErr) {
            // Rollback interview if we failed to deduct credits
            try {
                await Interview.findByIdAndDelete(interview._id);
            } catch (delErr) {
                console.error('Failed to rollback interview after credit deduction failure:', delErr);
            }
            return res.status(500).json({ message: 'Failed to deduct credits', error: creditErr.message });
        }

        res.json({
            interviewId: interview._id,
            creditsLeft: user.credits,
            userName: user.name,
            questions: interview.questions
        });



    } catch (error) {
        return res.status(500).json({ message: `failed to generate questions ${error}` });
    }
}

export const submitAnswer = async (req, res) => {
    try {
        const { interviewId, questionIndex, answer, timeTaken } = req.body;
        const interview = await Interview.findById(interviewId);
        const question = interview.questions[questionIndex];

        // if no answer provided.
        if (!answer) {
            question.score = 0;
            question.feedback = "No answer provided.";
            question.answer = "";

            await interview.save();
            return res.json({ feedback: question.feedback });
        }
        // if time exceeded.
        if (timeTaken > question.timeLimit) {
            question.score = 0;
            question.feedback = "Time limit exceeded.";
            question.answer = answer;

            await interview.save();
            return res.json({ feedback: question.feedback });
        }

        const messages = [
            {
                role: "system",
                content: `
                You are a professional human interviewer evaluating a candidate's answer in a real interview.

                Evaluate naturally and fairly, like a real person would.

                Score the answer in these areas (0 to 10):

                1. Confidence – Does the answer sound clear, confident, and well-presented?
                2. Communication – Is the language simple, clear, and easy to understand?
                3. Correctness – Is the answer accurate, relevant, and complete?
                
                Rules:
                - Be realistic and unbiased.
                - Do not give random high scores.
                - If the answer is weak, score low.
                - If the answer is strong and detailed, score high.
                - Consider clarity, structure, and relevance.

                Calculate:
                finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

                Feedback Rules:
                - Write natural human feedback.
                - 10 to 15 words only.
                - Sound like real interview feedback.
                - Can suggest improvement if needed.
                - Do NOT repeat the question.
                - Do NOT explain scoring.
                - Keep tone professional and honest.

                Return ONLY valid JSON in this format:
                
                {
                "confidence": number,
                "communication": number,
                "correctness": number,
                "finalScore": number,
                "feedback": "short human feedback"
                }
                `
            }
            ,
            {
                role: "user",
                content: `
                Question: ${question.question}
                Answer: ${answer}
                `
            }
        ];

        const aiResponse = await askAi(messages);
        let parsed;
        try {
            parsed = JSON.parse(aiResponse);
            question.answer = answer;
            question.confidence = parsed.confidence;
            question.communication = parsed.communication;
            question.correctness = parsed.correctness;
            question.score = parsed.finalScore;
            question.feedback = parsed.feedback;
            await interview.save();
            return res.status(200).json({ feedback: question.feedback });
        } catch (error) {
            return res.status(500).json({ message : `Failed to parse AI response ${error}` });
        }


    } catch (error) {
        return res.status(500).json({ message: `Failed to submit answer ${error}` });
    }
}

export const finishInterview = async (req, res) => {
    try {
        const { interviewId } = req.body;
        const interview = await Interview.findById(interviewId);
        if (!interviewId) {
            return res.status(400).json({ message: 'Interview ID is required' });
        }
        const totalQuestions = interview.questions.length;
        let totalScore = 0;
        let totalConfidence = 0;
        let totalCommunication = 0;
        let totalCorrectness = 0;

        interview.questions.forEach(q => {
            totalScore += q.score;
            totalConfidence += q.confidence;
            totalCommunication += q.communication;
            totalCorrectness += q.correctness;
        });

        const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
        const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
        const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
        const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;
        interview.finalScore = finalScore;
        interview.status = "completed";

        await interview.save();

        return res.status(200).json({
            finalScore: Number(finalScore.toFixed(1)),
            confidence: Number(avgConfidence.toFixed(1)),
            communication: Number(avgCommunication.toFixed(1)),
            correctness: Number(avgCorrectness.toFixed(1)),
            questionWiseScore: interview.questions.map(q => ({
                question: q.question,
                score: q.score || 0,
                feedback: q.feedback || "",
                confidence: q.confidence || 0,
                communication: q.communication || 0,
                correctness: q.correctness || 0,
            })),

        });

    } catch (error) {
        return res.status(500).json({ message: `Failed to finish interview ${error}` });
    }
}