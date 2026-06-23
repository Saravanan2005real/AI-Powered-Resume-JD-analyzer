import fs from 'fs';
import path from 'path';
const { PDFParse } = require('pdf-parse');
import mammoth from 'mammoth';
import { parseStructuredResume } from './structuredParser';



export const extractTextFromFile = async (filePath: string, originalName: string): Promise<string> => {
  const ext = path.extname(originalName).toLowerCase();

  try {
    let text = '';
    console.log(`[DEBUG] Extracting text from ${originalName} (type: ${ext})`);
    
    if (ext === '.txt') {
      text = fs.readFileSync(filePath, 'utf-8');
    } else if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const uint8Array = new Uint8Array(dataBuffer);
      
      const { PDFParse } = require('pdf-parse');
      // The pdf-parse v2.4.5 package has options like lineEnforce.
      const parser = new PDFParse(uint8Array, { 
         lineEnforce: true, 
         lineThreshold: 5, 
         cellSeparator: '    ', 
         cellThreshold: 20 
      });
      // The parser.getText method returns an object with `text` or maybe a string? Let's check textExtractor's original code: 
      // const data = await parser.getText(); text = data.text;
      const data = await parser.getText();
      // data might be a string in v2 or an object with .text. Let's handle both.
      text = typeof data === 'string' ? data : (data.text || '');
    } else if (ext === '.docx' || ext === '.doc') {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else {
      throw new Error(`Unsupported file type: ${ext}`);
    }

    if (!text || text.trim().length === 0) {
      throw new Error(`Extracted text is empty for ${originalName}`);
    }

    console.log(`[DEBUG] Successfully extracted ${text.length} characters from ${originalName}`);
    
    // Sanitize invisible characters that might break JSON parsing later
    text = text.replace(/[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g, ' ');

    return text;

  } catch (error: any) {
    console.error(`[ERROR] Text extraction failed for ${originalName}:`, error.message);
    throw new Error(`Failed to extract text from ${originalName}: ${error.message}`);
  }
};
