// =============================================
// Database Seed Script
// =============================================
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Cadet = require('../models/Cadet');
const Camp = require('../models/Camp');
const Achievement = require('../models/Achievement');
const Attendance = require('../models/Attendance');
const StudyMaterial = require('../models/StudyMaterial');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ncc_maharashtra';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Cadet.deleteMany({}),
      Camp.deleteMany({}),
      Achievement.deleteMany({}),
      Attendance.deleteMany({}),
      StudyMaterial.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create Admin User
    const adminUser = await User.create({
      fullName: 'Sqn Ldr Rajesh Sharma',
      email: 'admin@ncc1mah.in',
      password: 'admin123456',
      role: 'admin',
      phone: '9876543210',
      rank: 'Squadron Leader',
      designation: 'ANO',
      serviceId: 'NCC-ANO-001',
      unitAssignment: '01 MAH AIR SQN NCC, MUMBAI (NASHIK DETACHMENT)'
    });
    console.log('✅ Admin user created: admin@ncc1mah.in / admin123456');

    // Create Cadet Users
    const cadetUsers = [];
    const cadetProfiles = [];
    const cadetData = [
      { name: 'Rahul Kumar', father: 'Suresh Kumar', mother: 'Sunita Kumar', enroll: 'MAH-AIR-2024-001', mobile: '9876543001', course: 'B.Tech', college: 'MVPS KBT COE', year: '2nd Year', sdSw: 'SD', blood: 'B+' },
      { name: 'Priya Deshmukh', father: 'Mahesh Deshmukh', mother: 'Asha Deshmukh', enroll: 'MAH-AIR-2024-002', mobile: '9876543002', course: 'BBA', college: 'HPT Arts & RYK Science College', year: '1st Year', sdSw: 'SW', blood: 'A+' },
      { name: 'Amit Patil', father: 'Rajendra Patil', mother: 'Meena Patil', enroll: 'MAH-AIR-2024-003', mobile: '9876543003', course: 'B.Sc', college: 'KRT Arts BH Commerce College', year: '3rd Year', sdSw: 'SD', blood: 'O+' },
      { name: 'Sneha Joshi', father: 'Vinay Joshi', mother: 'Kavita Joshi', enroll: 'MAH-AIR-2024-004', mobile: '9876543004', course: 'BA', college: 'KTHM College', year: '2nd Year', sdSw: 'SW', blood: 'AB+' },
      { name: 'Vikram Singh', father: 'Balwinder Singh', mother: 'Gurpreet Kaur', enroll: 'MAH-AIR-2024-005', mobile: '9876543005', course: 'B.Com', college: 'BYSN College', year: '1st Year', sdSw: 'SD', blood: 'A-' },
    ];

    for (const c of cadetData) {
      const user = await User.create({
        fullName: c.name, email: `${c.enroll.toLowerCase().replace(/[^a-z0-9]/g, '')}@ncc.in`,
        password: 'cadet123456', role: 'cadet', phone: c.mobile
      });
      cadetUsers.push(user);

      const cadet = await Cadet.create({
        userId: user._id, cadetName: c.name, fatherName: c.father, motherName: c.mother,
        dob: new Date(2003, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        bloodGroup: c.blood, aadharNumber: String(Math.floor(Math.random() * 900000000000) + 100000000000),
        cadetMobile: c.mobile, fatherMobile: '98765' + String(Math.floor(Math.random() * 100000)).padStart(5, '0'),
        motherMobile: '98765' + String(Math.floor(Math.random() * 100000)).padStart(5, '0'),
        enrollmentNumber: c.enroll, sdSw: c.sdSw, year: c.year,
        enrolledCourse: c.course, collegeName: c.college, university: 'Savitribai Phule Pune University',
        residentialAddress: 'Nashik, Maharashtra', pincode: '422001', nearbyRailwayStation: 'Nashik Road',
        bankName: 'State Bank of India', accountNumber: String(Math.floor(Math.random() * 90000000000) + 10000000000),
        ifscCode: 'SBIN0001234', micrCode: '422002001'
      });
      cadetProfiles.push(cadet);
    }
    console.log('✅ 5 Cadet users created (password: cadet123456)');

    // Create Camps
    const camps = await Camp.insertMany([
      { name: 'Annual Training Camp 2026', type: 'Annual Training Camp', location: 'Nashik Camp Ground', startDate: new Date(2026, 3, 15), endDate: new Date(2026, 3, 25), description: 'Annual training camp for all cadets', maxCadets: 50, status: 'upcoming', createdBy: adminUser._id, registeredCadets: cadetProfiles.map(c => c._id) },
      { name: 'CATC Maharashtra 2026', type: 'Combined Annual Training Camp', location: 'Pune Military Area', startDate: new Date(2026, 5, 1), endDate: new Date(2026, 5, 12), description: 'Combined annual training camp', maxCadets: 100, status: 'upcoming', createdBy: adminUser._id },
      { name: 'Republic Day Camp 2026', type: 'Republic Day Camp', location: 'New Delhi', startDate: new Date(2026, 0, 20), endDate: new Date(2026, 0, 30), description: 'Republic Day parade camp', maxCadets: 10, status: 'completed', createdBy: adminUser._id, registeredCadets: [cadetProfiles[0]._id, cadetProfiles[2]._id] },
      { name: 'National Integration Camp', type: 'National Integration Camp', location: 'Nagpur', startDate: new Date(2026, 7, 10), endDate: new Date(2026, 7, 20), description: 'NIC for inter-state cadets', maxCadets: 30, status: 'upcoming', createdBy: adminUser._id },
    ]);
    console.log('✅ 4 Camps created');

    // Create Achievements
    await Achievement.insertMany([
      { cadetId: cadetProfiles[0]._id, title: 'Best Cadet Award - ATC 2025', category: 'Best Cadet', description: 'Awarded best cadet during Annual Training Camp', dateAwarded: new Date(2025, 11, 20), awardedBy: 'Commanding Officer', level: 'Group', createdBy: adminUser._id },
      { cadetId: cadetProfiles[1]._id, title: 'Firing Competition Winner', category: 'Firing', description: '1st place in .22 Rifle shooting', dateAwarded: new Date(2025, 10, 15), awardedBy: 'Group HQ', level: 'Directorate', createdBy: adminUser._id },
      { cadetId: cadetProfiles[2]._id, title: 'Drill Competition Runner-up', category: 'Drill', description: 'Runner-up in inter-unit drill competition', dateAwarded: new Date(2025, 9, 10), awardedBy: 'DG NCC', level: 'National', createdBy: adminUser._id },
      { cadetId: cadetProfiles[0]._id, title: 'Social Service Excellence', category: 'Social Service', description: 'Led blood donation drive - 50+ units collected', dateAwarded: new Date(2025, 8, 5), awardedBy: 'Unit CO', level: 'Unit', createdBy: adminUser._id },
      { cadetId: cadetProfiles[3]._id, title: 'Sports Champion - 100m Sprint', category: 'Sports', description: 'Won gold medal in inter-NCC sports meet', dateAwarded: new Date(2025, 7, 20), awardedBy: 'Group HQ', level: 'Group', createdBy: adminUser._id },
    ]);
    console.log('✅ 5 Achievements created');

    // Create Attendance Records
    const attendanceRecords = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(2026, 1, i + 1);
      if (date.getDay() === 0) continue; // Skip Sundays
      for (const cadet of cadetProfiles) {
        const statuses = ['present', 'present', 'present', 'present', 'absent', 'late', 'present'];
        attendanceRecords.push({
          cadetId: cadet._id, date,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          gpsLatitude: 19.9975 + Math.random() * 0.01,
          gpsLongitude: 73.7898 + Math.random() * 0.01,
          gpsVerified: true,
          reviewedBy: adminUser._id,
          reviewedAt: date
        });
      }
    }
    await Attendance.insertMany(attendanceRecords);
    console.log(`✅ ${attendanceRecords.length} Attendance records created`);

    // Create Study Materials
    await StudyMaterial.insertMany([
      { title: 'Drill Manual - Part 1', description: 'Basic drill movements and commands', category: 'Drill', year: '1st Year', fileUrl: '/materials/drill-manual-1.pdf', fileName: 'drill-manual-1.pdf', fileSize: 2048000, uploadedBy: adminUser._id },
      { title: 'Map Reading Basics', description: 'Introduction to map reading and compass work', category: 'Map Reading', year: 'All Years', fileUrl: '/materials/map-reading.pdf', fileName: 'map-reading.pdf', fileSize: 3072000, uploadedBy: adminUser._id },
      { title: 'Weapon Training - .22 Rifle', description: 'Safety and handling of .22 Deluxe Rifle', category: 'Weapon Training', year: '2nd Year', fileUrl: '/materials/weapon-training.pdf', fileName: 'weapon-training.pdf', fileSize: 1536000, uploadedBy: adminUser._id },
      { title: 'Field Craft & Battle Craft', description: 'Advanced field craft techniques', category: 'Field Craft', year: '3rd Year', fileUrl: '/materials/field-craft.pdf', fileName: 'field-craft.pdf', fileSize: 4096000, uploadedBy: adminUser._id },
      { title: 'National Integration Topics', description: 'Study material for NI lectures', category: 'National Integration', year: 'All Years', fileUrl: '/materials/ni-topics.pdf', fileName: 'ni-topics.pdf', fileSize: 1024000, uploadedBy: adminUser._id },
    ]);
    console.log('✅ 5 Study Materials created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Login: admin@ncc1mah.in / admin123456');
    console.log('Cadet Login: Use enrollment number + cadet123456');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
}

seedDatabase();
