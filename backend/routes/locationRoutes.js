import express from 'express';
import { 
  getWilayas, 
  getdairas, 
  getBaladias 
} from '../controllers/locationController.js';

const router = express.Router();

// المستوى الأول: جلب كل الولايات
// GET /api/locations/wilayas
router.get('/wilayas', getWilayas);

// المستوى الثاني: جلب المقاطعات حسب الولاية
// GET /api/locations/wilayas/:wilaya/daira
router.get('/wilayas/:wilaya/daira', getdairas);

// المستوى الثالث: جلب البلديات حسب المقاطعة
// GET /api/locations/wilayas/:wilaya/daira/:daira/baladias
router.get('/wilayas/:wilaya/daira/:daira/baladias', getBaladias);

export default router;