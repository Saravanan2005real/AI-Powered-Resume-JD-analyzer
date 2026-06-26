import dotenv from 'dotenv';
dotenv.config();
import { analyzeResume } from './services/groqService';
import fs from 'fs';

async function test() {
  try {
    const jd = fs.readFileSync('sample_jd.txt', 'utf8');
    const res = fs.readFileSync('sample_resume.txt', 'utf8');
    const data = await analyzeResume(jd, res, 'sample_resume.txt');
    console.log('SUCCESS:', data.candidateName);
  } catch (e: any) {
    console.error('ERROR:', e.message);
  }
}
test();
