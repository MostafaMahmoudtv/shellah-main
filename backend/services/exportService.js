import ExcelJS from 'exceljs';
import User from '../models/User.js';

export const exportDonorsToExcel = async (res) => {
  const donors = await User.find({ role: 'donor' }).select('name phone bloodType wilaya daira baladia isActive createdAt');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('المتبرعين');
  
  worksheet.columns = [
    { header: 'الاسم', key: 'name', width: 20 },
    { header: 'الهاتف', key: 'phone', width: 15 },
    { header: 'فصيلة الدم', key: 'bloodType', width: 12 },
    { header: 'الولاية', key: 'wilaya', width: 20 },
    { header: 'الدائرة', key: 'daira', width: 20 },
    { header: 'البلدية', key: 'baladia', width: 20 },
    { header: 'الحالة', key: 'isActive', width: 10 },
    { header: 'تاريخ التسجيل', key: 'createdAt', width: 20 }
  ];
  
  donors.forEach(donor => {
    worksheet.addRow({
      name: donor.name,
      phone: donor.phone,
      bloodType: donor.bloodType,
      wilaya: donor.wilaya,
      daira: donor.daira,
      baladia: donor.baladia,
      isActive: donor.isActive ? 'نشط' : 'معطل',
      createdAt: donor.createdAt?.toLocaleDateString('ar-EG')
    });
  });
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=donors.xlsx');
  await workbook.xlsx.write(res);
  res.end();
};

export const exportAllUsersToExcel = async (res) => {
  const users = await User.find().select('name phone bloodType wilaya daira baladia role isActive createdAt');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('جميع المستخدمين');
  
  worksheet.columns = [
    { header: 'الاسم', key: 'name', width: 20 },
    { header: 'الهاتف', key: 'phone', width: 15 },
    { header: 'فصيلة الدم', key: 'bloodType', width: 12 },
    { header: 'الولاية', key: 'wilaya', width: 20 },
    { header: 'الدائرة', key: 'daira', width: 20 },
    { header: 'البلدية', key: 'baladia', width: 20 },
    { header: 'الصلاحية', key: 'role', width: 12 },
    { header: 'الحالة', key: 'isActive', width: 10 }
  ];
  
  users.forEach(user => worksheet.addRow(user.toJSON()));
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=all_users.xlsx');
  await workbook.xlsx.write(res);
  res.end();
};