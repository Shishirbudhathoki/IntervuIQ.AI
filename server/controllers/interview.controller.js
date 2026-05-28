import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { askAi } from '../services/openRouter.services.js';

export const analyzeResume = async (req, res) => {
    try {
        if(!req.file) {
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
        const messages=[
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
                role:"user",
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
        if(req.file && fs.existsSync(req.file.path)){
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({message: error.message});
    }
}