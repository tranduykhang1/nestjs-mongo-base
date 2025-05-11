import { Nullable } from 'src/common/types/common.type';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export class BaseRepository<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {
    this.repository = this.repository;
  }

  async create(input: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(input);
    return await this.repository.save(entity);
  }

  async findOne(
    filter: FindOptionsWhere<T>,
    options?: FindOneOptions<T>,
  ): Promise<Nullable<T>> {
    return await this.repository.findOne({ where: filter, ...options });
  }

  async findLastOne(
    filter: FindOptionsWhere<T>,
    options?: FindManyOptions<T>,
  ): Promise<Nullable<T>> {
    const results = await this.repository.find({
      where: filter,
      ...options,
      order: { id: 'DESC' } as any,
      take: 1,
    });
    return results.length > 0 ? results[0] : null;
  }

  async update(
    filter: FindOptionsWhere<T>,
    input: Partial<T>,
  ): Promise<Nullable<T>> {
    const entity = await this.repository.findOneBy(filter);
    if (!entity) return null;
    Object.assign(entity, input);
    return await this.repository.save(entity);
  }

  async updateMany(
    filter: FindOptionsWhere<T>,
    input: Partial<T>,
  ): Promise<void> {
    await this.repository.update(filter, input as any);
  }

  async delete(filter: FindOptionsWhere<T>): Promise<void> {
    await this.repository.delete(filter);
  }

  async count(filter: FindOptionsWhere<T>): Promise<number> {
    return await this.repository.count({ where: filter });
  }

  async findAndCount(
    filter: FindOptionsWhere<T>,
    paginate: {
      sortField: keyof T;
      sortOrder: 'ASC' | 'DESC';
      offset: number;
      limit: number;
    },
  ): Promise<{ items: T[]; total: number }> {
    const { sortField, sortOrder, offset, limit } = paginate;
    const [items, total] = await this.repository.findAndCount({
      where: filter,
      order: { [sortField]: sortOrder } as any,
      skip: offset,
      take: limit,
    });
    return { items, total };
  }
}
