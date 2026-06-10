import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { analyzeFiles, generatePdfReport } from '../controllers/analyzeController';

const router = Router();

// Route configuration
router.post('/', upload.fields([
  { name: 'jd', maxCount: 1 },
  { name: 'resumes', maxCount: 5 }
]), analyzeFiles);

// PDF Generation Route
router.post('/pdf', generatePdfReport);

export default router;
