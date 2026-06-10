import { Request, Response } from 'express';
import { extractTextFromFile } from '../services/textExtractor';
import { analyzeResume } from '../services/groqService';
import fs from 'fs';

export const analyzeFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files || !files['jd'] || files['jd'].length === 0) {
      res.status(400).json({ error: 'Job description file is missing.' });
      return;
    }

    if (!files['resumes'] || files['resumes'].length === 0) {
      res.status(400).json({ error: 'At least one resume file is required.' });
      return;
    }

    const jdFile = files['jd'][0];
    const resumeFiles = files['resumes'];

    if (resumeFiles.length > 5) {
      res.status(400).json({ error: 'Maximum of 5 resumes allowed.' });
      return;
    }

    // Extract text from JD
    const jdText = await extractTextFromFile(jdFile.path, jdFile.originalname);
    if (!jdText || jdText.trim().length === 0) {
      res.status(400).json({ error: 'Failed to extract text from Job Description or file is empty.' });
      return;
    }

    const results = [];

    // Process each resume
    for (const resume of resumeFiles) {
      try {
        const resumeText = await extractTextFromFile(resume.path, resume.originalname);
        
        if (!resumeText || resumeText.trim().length === 0) {
          throw new Error('File is empty or text could not be extracted.');
        }

        const analysis = await analyzeResume(jdText, resumeText, resume.originalname);
        
        results.push({
          candidateName: analysis.candidateName,
          matchPercentage: analysis.matchPercentage,
          atsScore: analysis.atsScore,
          skillsMatch: analysis.skillsMatch,
          missingSkills: analysis.missingSkills,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          recommendations: analysis.recommendations,
          originalName: resume.originalname
        });
      } catch (err: any) {
        console.error(`Error processing ${resume.originalname}:`, err.message);
        results.push({
          candidateName: resume.originalname,
          error: err.message,
          matchPercentage: 0
        });
      }
    }

    // Clean up uploaded files asynchronously
    try {
      fs.unlinkSync(jdFile.path);
      resumeFiles.forEach(r => fs.unlinkSync(r.path));
    } catch (cleanupErr) {
      console.error('Failed to clean up files:', cleanupErr);
    }

    // Sort results by match percentage descending
    results.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    // Add rank
    const rankedResults = results.map((result, index) => ({
      rank: index + 1,
      ...result
    }));

    res.json(rankedResults);

  } catch (error: any) {
    console.error('Analyze Controller Error:', error);
    res.status(500).json({ error: error.message || 'An error occurred during analysis.' });
  }
};
