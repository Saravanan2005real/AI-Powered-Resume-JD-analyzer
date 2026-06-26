import { analyzeResume } from './services/groqService';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function runTest() {
  try {
    const jdText = "Software Engineer with 3 years of experience in React and Node.js. Must know TypeScript.";
    const resumeText = fs.existsSync('./sample_resume.txt') ? fs.readFileSync('./sample_resume.txt', 'utf8') : "John Doe. Software Engineer. Knows React, Node.js, TypeScript. 4 years experience.";
    
    console.log("Testing analyzeResume...");
    const result = await analyzeResume(jdText, resumeText, "sample_resume.txt");
    console.log("Success! Result candidateName:", result.candidateName);
  } catch (err: any) {
    console.error("Test Error Name:", err.name);
    console.error("Test Error Message:", err.message);
  }
}

runTest();
