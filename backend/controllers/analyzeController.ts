import { Request, Response } from 'express';
import { extractTextFromFile } from '../services/textExtractor';
import { analyzeResume } from '../services/groqService';
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

    const results = [];

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

        console.log(`[DEBUG] Sending to Groq API for: ${resume.originalname}`);
        const analysis = await analyzeResume(jdText, resumeText, resume.originalname);
        console.log(`[DEBUG] Received valid analysis for: ${resume.originalname}, Match: ${analysis.matchPercentage}%`);
        
        results.push({
          ...analysis,
          originalName: resume.originalname
        });
      } catch (err: any) {
        console.error(`Analysis Pipeline Error for ${resume.originalname}:`, err.message || err);
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
    results.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    // Add rank
    const rankedResults = results.map((result, index) => ({
      rank: index + 1,
      ...result
    }));

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
      res.setHeader('Content-Disposition', `attachment; filename="CareerDNA_Report_${data.candidateName.replace(/\s+/g, '_')}.pdf"`);
      res.send(pdfBuffer);
      console.log(`Successfully generated PDF for candidate: ${data.candidateName}`);
    } else {
      console.log(`Generating ZIP archive for ${dataArray.length} reports...`);
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="CareerDNA_Reports.zip"');

      const archive = archiver('zip', { zlib: { level: 9 } });
      
      archive.on('error', (err: any) => {
        throw err;
      });

      archive.pipe(res);

      for (const data of dataArray) {
        console.log("Creating PDF...");
        const pdfBuffer = await generateProfessionalPdf(data);
        const fileName = `CareerDNA_Report_${data.candidateName.replace(/\s+/g, '_')}.pdf`;
        console.log("Adding PDF to ZIP...");
        archive.append(pdfBuffer, { name: fileName });
      }

      console.log("Finalizing archive...");
      await archive.finalize();
      console.log("ZIP created successfully");
    }

  } catch (error: any) {
    console.error('PDF Generation Error:', error.message || error);
    if (!res.headersSent) {
      res.status(500).json({ error: `An error occurred during PDF generation: ${error.message || 'Unknown error'}` });
    }
  }
};
