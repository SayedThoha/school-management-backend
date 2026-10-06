import { FilterQuery, UpdateQuery, PopulateOptions } from 'mongoose';

/**
 * Base generic repository interface following the Interface Segregation Principle (ISP)
 * and Open/Closed Principle (OCP).
 */
export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string, populate?: PopulateOptions | (string | PopulateOptions)[]): Promise<T | null>;
  findOne(filter: FilterQuery<T>, populate?: PopulateOptions | (string | PopulateOptions)[]): Promise<T | null>;
  find(
    filter?: FilterQuery<T>,
    populate?: PopulateOptions | (string | PopulateOptions)[],
    sort?: Record<string, 1 | -1>,
    skip?: number,
    limit?: number
  ): Promise<T[]>;
  update(id: string, updateData: UpdateQuery<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
  count(filter?: FilterQuery<T>): Promise<number>;
  exists(filter: FilterQuery<T>): Promise<boolean>;
}
