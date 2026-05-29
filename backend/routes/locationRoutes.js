import express from 'express';
import { 
  getWilayas, 
  getdairas, 
} from '../controllers/locationController.js';

const router = express.Router();

// المستوى الأول: جلب كل الولايات
// GET /api/locations/wilayas
router.get('/wilayas', getWilayas);

// المستوى الثاني: جلب المقاطعات حسب الولاية
// GET /api/locations/wilayas/:wilaya/daira
router.get('/wilayas/:wilaya/daira', getdairas);
export default router;