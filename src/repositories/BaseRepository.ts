import { Model, Document, FilterQuery, UpdateQuery, PopulateOptions } from 'mongoose';
import { IBaseRepository } from './interfaces/IBaseRepository.js';

/**
 * Generic BaseRepository implementation using Mongoose.
 * Open/Closed Principle: Can be extended by concrete repositories without altering base logic.
 * Liskov Substitution Principle: Any derived repository adheres to IBaseRepository.
 */
export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = new this.model(data);
    return await entity.save();
  }

  async findById(id: string, populate?: PopulateOptions | (string | PopulateOptions)[]): Promise<T | null> {
    let query = this.model.findById(id);
    if (populate) {
      query = query.populate(populate as any);
    }
    return await query.exec();
  }

  async findOne(filter: FilterQuery<T>, populate?: PopulateOptions | (string | PopulateOptions)[]): Promise<T | null> {
    let query = this.model.findOne(filter);
    if (populate) {
      query = query.populate(populate as any);
    }
    return await query.exec();
  }

  async find(
    filter: FilterQuery<T> = {},
    populate?: PopulateOptions | (string | PopulateOptions)[],
    sort?: Record<string, 1 | -1>,
    skip?: number,
    limit?: number
  ): Promise<T[]> {
    let query = this.model.find(filter);
    if (populate) {
      query = query.populate(populate as any);
    }
    if (sort) {
      query = query.sort(sort);
    }
    if (typeof skip === 'number') {
      query = query.skip(skip);
    }
    if (typeof limit === 'number') {
      query = query.limit(limit);
    }
    return await query.exec();
  }

  async update(id: string, updateData: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id).exec();
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return await this.model.countDocuments(filter).exec();
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const doc = await this.model.exists(filter);
    return doc !== null;
  }
}
