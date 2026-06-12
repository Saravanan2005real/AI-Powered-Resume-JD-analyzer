import dotenv from 'dotenv';
dotenv.config();

console.log("ENV RESULT:", process.env.GROQ_API_KEY ? "Loaded" : "Missing");
console.log("GROQ KEY:", process.env.GROQ_API_KEY ? "Loaded" : "Missing");
import express from 'express';
import cors from 'cors';
import analyzeRoutes from './routes/analyzeRoutes';
import { generatePdfReport } from './controllers/analyzeController';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analyze', analyzeRoutes);
app.post('/api/generate-pdf', generatePdfReport);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong on the server!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
