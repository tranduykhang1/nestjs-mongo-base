import { BadRequestException, Logger } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { BaseError } from '../errors/base.error';
import { Errors } from '../errors/constants.error';
import { BaseRepository } from '../repositories/base.repository';
import { Nullable } from 'src/common/types/common.type';

export class BaseService<T> {
  private readonly modelName: string;
  private readonly serviceLogger = new Logger(BaseService.name);

  constructor(private readonly repository: BaseRepository<T>) {
    this.repository = repository;
  }

  async create(input: FilterQuery<T>, createdBy = ''): Promise<T> {
    try {
      const createInput = { ...input, createdBy };
      const createdData = await this.repository.create(createInput);
      if (!createdData)
        throw new BadRequestException(
          `CREATE_FAIL_FOR_${this.modelName.toLowerCase()}`,
        );
      return createdData;
    } catch (err) {
      throw this.handleServiceError(err, 'Create');
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<Nullable<T>> {
    try {
      const queryFilter: FilterQuery<T> = { ...filter };

      const result = await this.repository.findOne(queryFilter);

      return result ?? null;
    } catch (err) {
      throw this.handleServiceError(err, `FindOne ${this.modelName}`);
    }
  }

  async findOneUseStrict(filter: FilterQuery<T>): Promise<T> {
    try {
      const queryFilter: FilterQuery<T> = { ...filter };

      const result = await this.repository.findOne(queryFilter);

      if (!result) throw new BaseError(Errors.COMMON_NOT_FOUND_ERROR);

      return result;
    } catch (err) {
      throw this.handleServiceError(err, `FindOne ${this.modelName}`);
    }
  }

  async findLastOne(filter: FilterQuery<T>): Promise<Nullable<T>> {
    try {
      const result = await this.repository.findLastOne(filter);

      return result ?? null;
    } catch (err) {
      throw this.handleServiceError(err, `FindLastOne ${this.modelName}`);
    }
  }

  async update(
    filter: FilterQuery<T>,
    input: Partial<Record<keyof T, unknown>>,
    updatedBy = '',
  ): Promise<Nullable<T>> {
    try {
      const updateInput = { ...input, updatedBy };
      const result = await this.repository.update(filter, updateInput);
      if (!result)
        throw this.handleServiceError({}, `${this.modelName} not found`);
      return result;
    } catch (err) {
      throw this.handleServiceError(err, `Update ${this.modelName}`);
    }
  }

  async softDelete(
    filter: Record<keyof T, any> | any,
    deletedBy = '',
  ): Promise<void> {
    try {
      const [foundDocument] = await Promise.all([
        this.repository.findOne(filter),
        this.repository.updateMany(filter, {
          deletedAt: new Date(),
          isDeleted: true,
          deletedBy,
        }),
      ]);
      if (!foundDocument)
        throw new BadRequestException(`${this.modelName} not found`);
    } catch (err) {
      this.handleServiceError(err, `SoftDelete ${this.modelName}`);
    }
  }

  async delete(filter: Record<keyof T, any> | any): Promise<Nullable<T>> {
    try {
      return (await this.repository.delete(filter)) ?? null;
    } catch (err) {
      throw this.handleServiceError(err, `Delete ${this.modelName}`);
    }
  }

  async count(filter: FilterQuery<T>): Promise<number> {
    try {
      return await this.repository.count({ ...filter });
    } catch (err) {
      throw this.handleServiceError(err, `Count ${this.modelName}`);
    }
  }

  private handleServiceError(err: any, operation: string): void {
    this.serviceLogger.error(
      `Error occurred during ${operation} operation for ${this.modelName}:`,
    );
    this.serviceLogger.error(err);
    throw new BaseError(Errors.COMMON_ERROR);
  }
}
