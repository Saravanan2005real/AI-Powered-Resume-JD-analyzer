import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'A'.repeat(20000) }],
      model: 'llama-3.3-70b-versatile',
    });
    console.log('Success:', completion.choices[0]?.message?.content);
  } catch (err: any) {
    console.log('Error Name:', err.name);
    console.log('Error Message:', err.message);
    console.log('Error Status:', err.status);
  }
}

test();
