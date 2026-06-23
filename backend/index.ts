import dotenv from 'dotenv';
dotenv.config();

console.log("ENV RESULT:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");
console.log("GEMINI KEY:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");
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
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/analyze', analyzeRoutes);
app.post('/api/generate-pdf', generatePdfReport);

// Catch 404
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(404).json({ error: 'API route not found' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Global Error]', err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong on the server!' });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});