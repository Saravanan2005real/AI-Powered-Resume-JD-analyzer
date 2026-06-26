import { Request, Response } from 'express';
import { extractTextFromFile } from '../services/textExtractor';
import { analyzeResume, compareResumes } from '../services/groqService';
import { calculateDeterministicScores } from '../services/scoringService';
import fs from 'fs';
import { generateProfessionalPdf } from '../services/pdfService';
const archiver = require('archiver');

export const analyzeFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files || !files['jd'] || files['jd'].length === 0) {
      console.error('Validation Error: Job description file is missing.');
      res.status(400).json({ error: 'Job description file is missing. Please upload a JD.' });
      return;
    }

    if (!files || !files['resumes'] || files['resumes'].length === 0) {
      console.error('Validation Error: Resume files are missing.');
      res.status(400).json({ error: 'At least one resume file is required for analysis.' });
      return;
    }

    const jdFile = files['jd'][0];
    const resumeFiles = files['resumes'];

    if (resumeFiles.length > 5) {
      res.status(400).json({ error: 'Maximum of 5 resumes allowed.' });
      return;
    }

    let jdText = '';
    try {
      console.log(`[DEBUG] JD extraction start: ${jdFile.originalname}`);
      jdText = await extractTextFromFile(jdFile.path, jdFile.originalname);
      console.log(`[DEBUG] JD extracted length: ${jdText?.length || 0} characters`);
      
      if (!jdText || jdText.trim().length === 0) {
        throw new Error('JD extraction failed.');
      }
    } catch (jdExtError: any) {
      console.error(`File Extraction Error (JD - ${jdFile.originalname}):`, jdExtError.message || jdExtError);
      res.status(400).json({ error: `Failed to extract text from Job Description: ${jdExtError.message || 'Unknown extraction error'}` });
      return;
    }

    let results = [];

    // Process each resume
    for (const resume of resumeFiles) {
      try {
        let resumeText = '';
        try {
          console.log(`[DEBUG] Resume extraction start: ${resume.originalname}`);
          resumeText = await extractTextFromFile(resume.path, resume.originalname);
          console.log(`[DEBUG] Resume extracted length: ${resumeText?.length || 0} characters`);
          
          if (!resumeText || resumeText.trim().length === 0) {
            throw new Error('Resume extraction failed.');
          }
        } catch (resExtError: any) {
          console.error(`File Extraction Error (Resume - ${resume.originalname}):`, resExtError.message || resExtError);
          throw new Error(`Failed to extract text: ${resExtError.message || 'Unknown extraction error'}`);
        }

        // Wait between requests to spread out TPM usage for Groq Free Tier (15 seconds)
        if (results.length > 0) {
          console.log(`[DEBUG] Waiting 15 seconds before processing next resume to respect rate limits...`);
          await new Promise(resolve => setTimeout(resolve, 15000));
        }

        console.log(`[DEBUG] Sending to Groq API for: ${resume.originalname}`);
        
        let analysis: any;
        let retries = 3;
        while (retries > 0) {
          try {
            analysis = await analyzeResume(jdText, resumeText, resume.originalname);
            break;
          } catch (apiErr: any) {
            retries--;
            const isRateLimit = apiErr.message?.toLowerCase().includes('rate limit');
            console.error(`[WARN] Groq API Error for ${resume.originalname}, retries left: ${retries}. Error: ${apiErr.message}`);
            
            if (retries === 0) throw apiErr;
            
            if (isRateLimit) {
              console.log(`[DEBUG] Rate limit hit. Waiting 60 seconds before retrying...`);
              await new Promise(resolve => setTimeout(resolve, 60000));
            } else {
              // Wait longer before generic retry
              await new Promise(resolve => setTimeout(resolve, 5000));
            }
          }
        }
        
        if (!analysis || !analysis.candidateName) {
           throw new Error('Validation Error: Invalid JSON returned from Groq (missing candidateName)');
        }

        console.log(`[DEBUG] Calculating deterministic scores for: ${resume.originalname}`);
        const scores = calculateDeterministicScores(analysis);
        
        const finalScore = scores.finalScore || 0;

        // Map new schema fields to legacy fields for backward compatibility with frontend
        analysis.skillsMatched = analysis.skillMatrix?.map((s: any) => s.skill) || [];
        analysis.missingSkills = [
          ...(analysis.missingSkills?.critical || []),
          ...(analysis.missingSkills?.important || []),
          ...(analysis.missingSkills?.optional || [])
        ];
        analysis.careerPotential = analysis.careerGrowthPotential || '';
        analysis.recommendations = analysis.improvementSuggestions || [];
        analysis.verdict = analysis.finalVerdict || '';
        analysis.atsScore = scores.atsScore || 0;
        if (!analysis.atsAnalysis) analysis.atsAnalysis = { score: analysis.atsScore, recommendations: [] };
        
        // Convert complex project/internship structures to strings for legacy UI
        analysis.projectAnalysis = analysis.projects?.map((p: any) => p.projectName).join(', ') || 'No specific projects found.';
        analysis.experienceAnalysis = `Highly Relevant: ${analysis.internships?.highlyRelevant?.length || 0}, Moderately Relevant: ${analysis.internships?.moderatelyRelevant?.length || 0}`;
        analysis.certificationAnalysis = analysis.certifications?.map((c: any) => c.certification).join(', ') || 'None';

        // Map final score to matchPercentage to ensure legacy frontend UI compatibility
        analysis.finalScore = finalScore;
        analysis.matchPercentage = finalScore;
        analysis.calculatedScores = scores; // Provide detailed scores for PDF gen
        if (!analysis.matchScores) analysis.matchScores = {};
        analysis.matchScores.overall = finalScore;
        
        // Expose processed arrays for PDF Service
        analysis.processedArrays = scores.processedArrays;

        console.log(`[DEBUG] ATS Score for ${resume.originalname}: ${scores.atsScore}`);
        console.log(`[DEBUG] Candidate Name: ${analysis.candidateName}`);
        console.log(`[DEBUG] Received valid analysis for: ${resume.originalname}, Final Score: ${finalScore}%`);
        console.log(`[DEBUG] Report Generation Status: SUCCESS for ${resume.originalname}`);
        
        results.push({
          ...analysis,
          originalName: resume.originalname
        });
      } catch (err: any) {
        console.error(`[ERROR] Analysis Pipeline Error for ${resume.originalname}:`);
        console.error(err.stack || err);
        console.error(`Status Code: ${err.status || 500}`);
        console.error(`Error Message: ${err.message || 'Unknown Error'}`);
        results.push({
          candidateName: resume.originalname,
          error: err.message || 'An error occurred during analysis pipeline',
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
    results.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
    
    // Add rank
    let rankedResults = results.map((result, index) => ({
      ...result,
      rank: index + 1
    }));

    // Multi-Resume Comparison
    if (rankedResults.length > 1 && !rankedResults.every(r => r.error)) {
      console.log(`[DEBUG] Triggering Multi-Resume Comparison for ${rankedResults.length} candidates...`);
      rankedResults = await compareResumes(jdText, rankedResults);
    }

    res.json(rankedResults);

  } catch (error: any) {
    console.error('Critical Analyze Controller Error:', error.message || error);
    res.status(500).json({ error: error.message || 'A critical error occurred during the analysis process.' });
  }
};

export const generatePdfReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const analysisData = req.body;
    
    if (!Array.isArray(analysisData) || analysisData.length === 0) {
      console.log(`[DEBUG] PDF Generation failed: Analysis data missing or not an array.`);
      res.status(400).json({ error: 'Analysis data missing. Please run analysis again.' });
      return;
    }

    // Check if all items are just errors
    const validData = analysisData.filter(d => !d.error);
    if (validData.length === 0) {
       console.log(`[DEBUG] PDF Generation failed: No valid analysis data found (only errors).`);
       res.status(400).json({ error: 'Valid analysis data is missing. Please run analysis again.' });
       return;
    }
    
    const dataArray = validData;
    console.log(`[DEBUG] Generating PDF/ZIP for ${dataArray.length} valid candidates.`);

    if (dataArray.length === 1) {
      const data = dataArray[0];
      console.log(`Generating single PDF for candidate: ${data.candidateName}`);
      const pdfBuffer = await generateProfessionalPdf(data);
      
      res.setHeader('Content-Type', 'application/pdf');
      const safeName = (data.candidateName || 'Candidate').replace(/\s+/g, '');
      res.setHeader('Content-Disposition', `attachment; filename="CareerDNA_Report_${safeName}.pdf"`);
      res.send(pdfBuffer);
      console.log(`[DEBUG] PDF Generation Status: SUCCESS for ${data.candidateName}`);
    } else {
      console.log(`Generating ZIP archive for ${dataArray.length} reports...`);
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="CareerDNA_Reports.zip"');

      const archive = archiver('zip', { zlib: { level: 9 } });
      
      archive.on('error', (err: any) => {
        console.error('[ERROR] ZIP generation error:', err.stack || err);
        throw new Error(`ZIP generation failed: ${err.message}`);
      });

      archive.pipe(res);

      for (const data of dataArray) {
        console.log(`Creating PDF for ${data.candidateName}...`);
        const pdfBuffer = await generateProfessionalPdf(data);
        const safeName = (data.candidateName || 'Candidate').replace(/\s+/g, '');
        const fileName = `${safeName}_Report.pdf`;
        console.log(`Adding ${fileName} to ZIP...`);
        archive.append(pdfBuffer, { name: fileName });
      }

      console.log("Finalizing archive...");
      await archive.finalize();
      console.log(`[DEBUG] ZIP Generation Status: SUCCESS for ${dataArray.length} reports`);
    }

  } catch (error: any) {
    console.error('[ERROR] PDF/ZIP Generation Error:', error.stack || error);
    if (!res.headersSent) {
      res.status(500).json({ error: `PDF/ZIP generation failed: ${error.message || 'Unknown error'}` });
    }
  }
};
