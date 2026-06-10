import fs from 'fs';
import path from 'path';
const { PDFParse } = require('pdf-parse');
import mammoth from 'mammoth';

export const extractTextFromFile = async (filePath: string, originalName: string): Promise<string> => {
  const ext = path.extname(originalName).toLowerCase();

  try {
    if (ext === '.txt') {
      return fs.readFileSync(filePath, 'utf-8');
    } else if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const uint8Array = new Uint8Array(dataBuffer);
      const parser = new PDFParse(uint8Array);
      const data = await parser.getText();
      return data.text;
    } else if (ext === '.docx' || ext === '.doc') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else {
      throw new Error(`Unsupported file type: ${ext}`);
    }
  } catch (error: any) {
    throw new Error(`Failed to extract text from ${originalName}: ${error.message}`);
  }
};
