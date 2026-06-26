import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { analyzeFiles, generatePdfReport } from '../controllers/analyzeController';

const router = Router();

// Route request logging middleware
router.use((req, res, next) => {
  console.log("\n================================");
  console.log("ANALYSIS REQUEST RECEIVED");
  console.log("METHOD:", req.method);
  console.log("PATH:", req.originalUrl);
  console.log("================================\n");
  next();
});

// Route configuration
router.post('/', upload.fields([
  { name: 'jd', maxCount: 1 },
  { name: 'resumes', maxCount: 5 }
]), analyzeFiles);

// PDF Generation Route
router.post('/pdf', generatePdfReport);

export default router;
