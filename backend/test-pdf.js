const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function test() {
  const dataBuffer = fs.readFileSync('package.json'); // just dummy buffer
  try {
    const parser = new PDFParse(dataBuffer);
    const data = await parser.getText();
    console.log('data.text exists:', typeof data.text === 'string');
  } catch (e) {
    console.log('error', e.message);
  }
}
test();
