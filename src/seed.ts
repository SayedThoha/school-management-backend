import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDatabase } from './config/db.js';
import { User } from './models/User.js';
import { Teacher } from './models/Teacher.js';
import { Class } from './models/Class.js';
import { Subject } from './models/Subject.js';
import { Student } from './models/Student.js';
import { Attendance } from './models/Attendance.js';

async function seedDatabase() {
  try {
    await connectDatabase();
    console.log('[Seed] Clearing existing collections...');

    await Promise.all([
      User.deleteMany({}),
      Teacher.deleteMany({}),
      Class.deleteMany({}),
      Subject.deleteMany({}),
      Student.deleteMany({}),
      Attendance.deleteMany({}),
    ]);

    console.log('[Seed] Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    const teacherPassword = await bcrypt.hash('Teacher@123', salt);

    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@school.com',
      password: adminPassword,
      role: 'Admin',
    });

    const teacherUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@school.com',
      password: teacherPassword,
      role: 'Teacher',
    });

    console.log('[Seed] Creating teachers...');
    const teacher1 = await Teacher.create({
      name: 'Sarah Jenkins',
      subject: 'Mathematics',
      experience: 8,
      contactInfo: {
        phone: '+1 (555) 234-5678',
        email: 'sarah@school.com',
        address: '42 Maple Avenue, Springfield',
      },
      qualification: 'M.Sc. Mathematics, B.Ed.',
      userId: teacherUser._id,
    });

    const teacher2 = await Teacher.create({
      name: 'Dr. Robert Vance',
      subject: 'Physics',
      experience: 12,
      contactInfo: {
        phone: '+1 (555) 876-5432',
        email: 'robert.vance@school.com',
        address: '108 Oak Street, Springfield',
      },
      qualification: 'Ph.D. Applied Physics',
    });

    const teacher3 = await Teacher.create({
      name: 'Elena Rostova',
      subject: 'English Literature',
      experience: 6,
      contactInfo: {
        phone: '+1 (555) 456-7890',
        email: 'elena.rostova@school.com',
        address: '77 Elm Boulevard, Springfield',
      },
      qualification: 'M.A. English Literature',
    });

    console.log('[Seed] Creating classes...');
    const class10A = await Class.create({
      name: 'Grade 10',
      section: 'A',
      teacherId: teacher1._id,
      roomNumber: 'Room 201',
    });

    const class10B = await Class.create({
      name: 'Grade 10',
      section: 'B',
      teacherId: teacher2._id,
      roomNumber: 'Room 202',
    });

    const class9A = await Class.create({
      name: 'Grade 9',
      section: 'A',
      teacherId: teacher3._id,
      roomNumber: 'Room 105',
    });

    console.log('[Seed] Creating subjects...');
    await Subject.create([
      {
        name: 'Advanced Mathematics',
        code: 'MATH-101',
        description: 'Algebra, Trigonometry, and Calculus fundamentals',
        teacherId: teacher1._id,
        classId: class10A._id,
      },
      {
        name: 'Mechanics & Modern Physics',
        code: 'PHYS-101',
        description: 'Classical mechanics, thermodynamics, and optics',
        teacherId: teacher2._id,
        classId: class10A._id,
      },
      {
        name: 'World Literature & Composition',
        code: 'ENG-101',
        description: 'Critical essay writing and literary appreciation',
        teacherId: teacher3._id,
        classId: class10A._id,
      },
      {
        name: 'General Mathematics',
        code: 'MATH-901',
        description: 'Geometry and Foundations of Algebra',
        teacherId: teacher1._id,
        classId: class9A._id,
      },
    ]);

    console.log('[Seed] Creating students...');
    const student1 = await Student.create({
      name: 'Alexander Hayes',
      classId: class10A._id,
      rollNumber: '10A-01',
      age: 15,
      contactInfo: {
        phone: '+1 (555) 111-2222',
        email: 'alex.hayes@student.school.com',
        parentName: 'Marcus Hayes',
        address: '12 Willow Creek, Springfield',
      },
      gender: 'Male',
      isActive: true,
    });

    const student2 = await Student.create({
      name: 'Sophia Patel',
      classId: class10A._id,
      rollNumber: '10A-02',
      age: 16,
      contactInfo: {
        phone: '+1 (555) 222-3333',
        email: 'sophia.patel@student.school.com',
        parentName: 'Aarav Patel',
        address: '48 Pine Crest, Springfield',
      },
      gender: 'Female',
      isActive: true,
    });

    const student3 = await Student.create({
      name: 'Lucas Campbell',
      classId: class10A._id,
      rollNumber: '10A-03',
      age: 15,
      contactInfo: {
        phone: '+1 (555) 333-4444',
        email: 'lucas.campbell@student.school.com',
        parentName: 'David Campbell',
        address: '33 Birch Way, Springfield',
      },
      gender: 'Male',
      isActive: true,
    });

    const student4 = await Student.create({
      name: 'Maya Lin',
      classId: class10A._id,
      rollNumber: '10A-04',
      age: 15,
      contactInfo: {
        phone: '+1 (555) 444-5555',
        email: 'maya.lin@student.school.com',
        parentName: 'Wei Lin',
        address: '90 Cedar Ridge, Springfield',
      },
      gender: 'Female',
      isActive: true,
    });

    const student5 = await Student.create({
      name: 'Ethan Brooks',
      classId: class10B._id,
      rollNumber: '10B-01',
      age: 16,
      contactInfo: {
        phone: '+1 (555) 555-6666',
        email: 'ethan.brooks@student.school.com',
        parentName: 'Thomas Brooks',
        address: '15 Highfield Lane, Springfield',
      },
      gender: 'Male',
      isActive: true,
    });

    const student6 = await Student.create({
      name: 'Chloe Dubois',
      classId: class10B._id,
      rollNumber: '10B-02',
      age: 15,
      contactInfo: {
        phone: '+1 (555) 666-7777',
        email: 'chloe.dubois@student.school.com',
        parentName: 'Claire Dubois',
        address: '88 River Street, Springfield',
      },
      gender: 'Female',
      isActive: true,
    });

    console.log('[Seed] Creating attendance records...');
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    await Attendance.create({
      date: todayStr,
      classId: class10A._id,
      markedBy: teacherUser._id,
      records: [
        { studentId: student1._id, status: 'Present', remarks: 'On time' },
        { studentId: student2._id, status: 'Present', remarks: 'On time' },
        { studentId: student3._id, status: 'Late', remarks: '10 minutes late due to traffic' },
        { studentId: student4._id, status: 'Absent', remarks: 'Medical leave informed' },
      ],
    });

    await Attendance.create({
      date: yesterdayStr,
      classId: class10A._id,
      markedBy: teacherUser._id,
      records: [
        { studentId: student1._id, status: 'Present', remarks: 'On time' },
        { studentId: student2._id, status: 'Present', remarks: 'On time' },
        { studentId: student3._id, status: 'Present', remarks: 'On time' },
        { studentId: student4._id, status: 'Present', remarks: 'On time' },
      ],
    });

    console.log('====================================================');
    console.log('  Database successfully seeded with demo data!');
    console.log('  Admin Account:');
    console.log('    Email:    admin@school.com');
    console.log('    Password: Admin@123');
    console.log('  Teacher Account:');
    console.log('    Email:    sarah@school.com');
    console.log('    Password: Teacher@123');
    console.log('====================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
}

seedDatabase();
