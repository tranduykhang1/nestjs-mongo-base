import { BadRequestException, Logger } from '@nestjs/common';
import { Nullable } from 'src/common/types/common.type';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
} from 'typeorm';
import { BaseError } from '../errors/base.error';
import { Errors } from '../errors/constants.error';
import { BaseRepository } from '../repositories/base.repository';

export class BaseService<T extends ObjectLiteral> {
  private readonly modelName: string;
  private readonly serviceLogger = new Logger(BaseService.name);

  constructor(private readonly repository: BaseRepository<T>) {
    this.repository = repository;
  }

  async create(input: DeepPartial<T>, createdBy = ''): Promise<T> {
    try {
      const createInput: DeepPartial<T> = { ...input, createdBy };
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

  async findOne(
    filter: FindOptionsWhere<T>,
    options?: FindOneOptions<T>,
  ): Promise<Nullable<T>> {
    try {
      const queryFilter: FindOptionsWhere<T> = { ...filter };

      const result = await this.repository.findOne(queryFilter, options);

      return result ?? null;
    } catch (err) {
      throw this.handleServiceError(err, `FindOne ${this.modelName}`);
    }
  }

  async findOneUseStrict(filter: FindOptionsWhere<T>): Promise<T> {
    try {
      const queryFilter: FindOptionsWhere<T> = { ...filter };

      const result = await this.repository.findOne(queryFilter);

      if (!result) throw new BaseError(Errors.COMMON_NOT_FOUND_ERROR);

      return result;
    } catch (err) {
      throw this.handleServiceError(err, `FindOne ${this.modelName}`);
    }
  }

  async findLastOne(filter: FindOptionsWhere<T>): Promise<Nullable<T>> {
    try {
      const result = await this.repository.findLastOne(filter);

      return result ?? null;
    } catch (err) {
      throw this.handleServiceError(err, `FindLastOne ${this.modelName}`);
    }
  }

  async update(
    filter: FindOptionsWhere<T>,
    input: Partial<T>,
    updatedBy = '',
  ): Promise<T> {
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
        } as unknown as Partial<T>),
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

  async count(filter: FindOptionsWhere<T>): Promise<number> {
    try {
      return await this.repository.count(filter);
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
