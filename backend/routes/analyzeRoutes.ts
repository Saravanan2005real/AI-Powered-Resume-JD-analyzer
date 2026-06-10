import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { analyzeFiles } from '../controllers/analyzeController';

const router = Router();

// Route configuration
router.post('/', upload.fields([
  { name: 'jd', maxCount: 1 },
  { name: 'resumes', maxCount: 5 }
]), analyzeFiles);

export default router;
