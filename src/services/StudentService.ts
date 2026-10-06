import { IStudentRepository } from '../repositories/interfaces/IStudentRepository.js';
import { StudentRepository } from '../repositories/StudentRepository.js';
import { IClassRepository } from '../repositories/interfaces/IClassRepository.js';
import { ClassRepository } from '../repositories/ClassRepository.js';
import { IStudent } from '../models/Student.js';

export class StudentService {
  private studentRepo: IStudentRepository;
  private classRepo: IClassRepository;

  constructor(
    studentRepo: IStudentRepository = new StudentRepository(),
    classRepo: IClassRepository = new ClassRepository()
  ) {
    this.studentRepo = studentRepo;
    this.classRepo = classRepo;
  }

  async getAllStudents(classId?: string, search?: string): Promise<IStudent[]> {
    if (search) {
      return await this.studentRepo.searchStudents(search, classId);
    }
    if (classId) {
      return await this.studentRepo.findByClass(classId);
    }
    return await this.studentRepo.find(
      { isActive: true },
      [{ path: 'classId', select: 'name section' }],
      { createdAt: -1 }
    );
  }

  async getStudentById(id: string): Promise<IStudent> {
    const student = await this.studentRepo.findById(id, [{ path: 'classId', select: 'name section' }]);
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  }

  async createStudent(data: Partial<IStudent>): Promise<IStudent> {
    if (!data.classId) {
      throw new Error('Class ID is required');
    }

    const classExists = await this.classRepo.findById(data.classId.toString());
    if (!classExists) {
      throw new Error('Assigned Class does not exist');
    }

    // Check if roll number already exists in this class
    if (data.rollNumber) {
      const existing = await this.studentRepo.findByRollNumber(data.classId.toString(), data.rollNumber);
      if (existing) {
        throw new Error(`Roll number '${data.rollNumber}' already exists in this class`);
      }
    }

    return await this.studentRepo.create(data);
  }

  async updateStudent(id: string, data: Partial<IStudent>): Promise<IStudent> {
    const existing = await this.studentRepo.findById(id);
    if (!existing) {
      throw new Error('Student not found');
    }

    if (data.classId) {
      const classExists = await this.classRepo.findById(data.classId.toString());
      if (!classExists) {
        throw new Error('Assigned Class does not exist');
      }
    }

    const targetClassId = data.classId ? data.classId.toString() : existing.classId.toString();
    const targetRollNumber = data.rollNumber || existing.rollNumber;

    if (data.rollNumber || data.classId) {
      const duplicate = await this.studentRepo.findByRollNumber(targetClassId, targetRollNumber);
      if (duplicate && duplicate._id.toString() !== id) {
        throw new Error(`Roll number '${targetRollNumber}' is already in use in this class`);
      }
    }

    const updated = await this.studentRepo.update(id, data);
    if (!updated) {
      throw new Error('Failed to update student');
    }
    return updated;
  }

  async deleteStudent(id: string): Promise<void> {
    const existing = await this.studentRepo.findById(id);
    if (!existing) {
      throw new Error('Student not found');
    }
    await this.studentRepo.delete(id);
  }
}
