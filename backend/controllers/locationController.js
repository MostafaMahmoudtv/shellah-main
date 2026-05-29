import { 
  getAllWilayas, 
  getdairasByWilaya, 
  getBaladiasBydaira,
  validateWilaya,
  validateDaira
} from '../utils/mauritanianRegions.js';
import catchAsync from '../utils/catchAsync.js';

// جلب كل الولايات (عربي + فرنسي)
export const getWilayas = catchAsync(async (req, res) => {
  const wilayas = getAllWilayas();
  res.json({ 
    success: true, 
    count: wilayas.length, 
    wilayas,
    message: 'القائمة تشمل العربية والفرنسية'
  });
});

// جلب المقاطعات حسب الولاية
export const getdairas = catchAsync(async (req, res) => {
  const { wilaya } = req.params;
  
  if (!validateWilaya(wilaya)) {
    return res.status(404).json({ 
      success: false, 
      message: `الولاية "${wilaya}" غير موجودة` 
    });
  }
  
  const dairas = getdairasByWilaya(wilaya);
  res.json({ 
    success: true, 
    wilaya, 
    count: dairas.length, 
    dairas
  });
});

// جلب البلديات حسب المقاطعة
export const getBaladias = catchAsync(async (req, res) => {
  const { wilaya, daira } = req.params;
  
  if (!validateWilaya(wilaya)) {
    return res.status(404).json({ 
      success: false, 
      message: `الولاية "${wilaya}" غير موجودة` 
    });
  }
  
  if (!validateDaira(wilaya, daira)) {
    return res.status(404).json({ 
      success: false, 
      message: `المقاطعة "${daira}" غير موجودة في ولاية "${wilaya}"` 
    });
  }
  
  const baladias = getBaladiasBydaira(wilaya, daira);
  res.json({ 
    success: true, 
    wilaya, 
    daira, 
    count: baladias.length, 
    baladias
  });
});