import { 
  getAllWilayas,
  getArabicWilayas,
  getFrenchWilayas,
  getMoughataasByWilaya, 
  getBaladiasByMoughataa,
  validateWilaya,
  validateMoughataa
} from '../utils/mauritanianRegions.js';
import catchAsync from '../utils/catchAsync.js';

// جلب كل الولايات (جميع اللغات)
export const getWilayas = catchAsync(async (req, res) => {
  const { lang } = req.query; // optional: 'ar' or 'fr'
  
  let wilayas;
  if (lang === 'ar') {
    wilayas = getArabicWilayas();
  } else if (lang === 'fr') {
    wilayas = getFrenchWilayas();
  } else {
    wilayas = getAllWilayas();
  }
  
  res.json({ 
    success: true, 
    count: wilayas.length, 
    wilayas
  });
});

// جلب المقاطعات حسب الولاية
export const getMoughataas = catchAsync(async (req, res) => {
  const { wilaya } = req.params;
  
  if (!validateWilaya(wilaya)) {
    return res.status(404).json({ 
      success: false, 
      message: `الولاية "${wilaya}" غير موجودة` 
    });
  }
  
  const moughataas = getMoughataasByWilaya(wilaya);
  res.json({ 
    success: true, 
    wilaya, 
    count: moughataas.length, 
    moughataas
  });
});

// جلب البلديات حسب المقاطعة
export const getBaladias = catchAsync(async (req, res) => {
  const { wilaya, moughataa } = req.params;
  
  if (!validateWilaya(wilaya)) {
    return res.status(404).json({ 
      success: false, 
      message: `الولاية "${wilaya}" غير موجودة` 
    });
  }
  
  if (!validateMoughataa(wilaya, moughataa)) {
    return res.status(404).json({ 
      success: false, 
      message: `المقاطعة "${moughataa}" غير موجودة في ولاية "${wilaya}"` 
    });
  }
  
  const baladias = getBaladiasByMoughataa(wilaya, moughataa);
  res.json({ 
    success: true, 
    wilaya, 
    moughataa, 
    count: baladias.length, 
    baladias
  });
});