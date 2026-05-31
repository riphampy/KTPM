const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const DoctorSchedule = require('./models/DoctorSchedule');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await DoctorSchedule.deleteMany();
    console.log('Cleared existing data.');

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('123456', salt);

    // 1. Create Admin
    await User.create({
      name: 'Quản trị viên Hệ thống',
      email: 'admin@hospital.com',
      password: defaultPassword,
      role: 'admin'
    });

    // 2. Create Doctors
    const doctorsData = [
      { name: 'Nguyễn Văn Tâm', email: 'bs.tam@hospital.com', role: 'doctor' },
      { name: 'Trần Thị Mai', email: 'bs.mai@hospital.com', role: 'doctor' },
      { name: 'Lê Hoàng Phát', email: 'bs.phat@hospital.com', role: 'doctor' },
      { name: 'Phạm Thu Thủy', email: 'bs.thuy@hospital.com', role: 'doctor' },
      { name: 'Hoàng Quốc Việt', email: 'bs.viet@hospital.com', role: 'doctor' }
    ];

    const createdDoctors = [];
    for (const d of doctorsData) {
      const doc = await User.create({ ...d, password: defaultPassword });
      createdDoctors.push(doc);
    }

    // 3. Create Patients
    const patientsData = [
      { name: 'Bùi Anh Tuấn', email: 'bn.tuan@gmail.com', role: 'patient' },
      { name: 'Đặng Ngọc Hương', email: 'bn.huong@gmail.com', role: 'patient' },
      { name: 'Vũ Đức Toàn', email: 'bn.tuan2@gmail.com', role: 'patient' },
      { name: 'Ngô Thanh Hà', email: 'bn.ha@gmail.com', role: 'patient' },
      { name: 'Đỗ Chí Dũng', email: 'bn.dung@gmail.com', role: 'patient' }
    ];

    for (const p of patientsData) {
      await User.create({ ...p, password: defaultPassword });
    }

    // 4. Create Schedules for Doctors
    const shifts = ['Morning', 'Afternoon', 'Evening'];
    for (const doc of createdDoctors) {
      // Create 5 days of schedules for each doctor
      for (let i = 1; i <= 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        date.setHours(0, 0, 0, 0);

        // Randomly pick a shift
        const shift = shifts[Math.floor(Math.random() * shifts.length)];

        await DoctorSchedule.create({
          doctorId: doc._id,
          date,
          shift,
          isAvailable: true
        });
      }
    }

    console.log('✅ Dữ liệu mẫu đã được nạp thành công!');
    console.log('Mật khẩu mặc định cho tất cả tài khoản: 123456');
    process.exit();
  } catch (error) {
    console.error('Lỗi khi nạp dữ liệu:', error);
    process.exit(1);
  }
};

seedData();
