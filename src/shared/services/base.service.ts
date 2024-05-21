import { BadRequestException, Logger } from '@nestjs/common';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { appConfig } from 'src/app.config';
import { Nullable } from 'src/common/types/types';
import { BaseEntity } from '../entities/base-object.entity';
import { ESortField, ESortOrder } from '../enums/sort.enum';
import { BaseError } from '../errors/base.error';
import { Errors } from '../errors/constants.error';

export abstract class BaseService<T extends BaseEntity> {
  private readonly modelName: string;
  private readonly serviceLogger = new Logger(BaseService.name);

  constructor(private readonly model: Model<T>) {
    if (appConfig.nodeEnv !== 'test') {
      for (const modelName of Object.keys(model.collection.conn.models)) {
        if (model.collection.conn.models[modelName] === this.model) {
          this.modelName = modelName;
          break;
        }
      }
    } else {
      this.modelName = 'TestModel';
    }
  }

  async create(input: FilterQuery<T>, createdBy = ''): Promise<T> {
    try {
      const createInput = { ...input, createdBy };
      const createdData = await this.model.create(createInput);
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
    filter: FilterQuery<T>,
    populates: { path: string; select?: string }[] = [],
    isDeleted = false,
  ): Promise<Nullable<T>> {
    try {
      const queryFilter: FilterQuery<T> = { ...filter, isDeleted };
      if (isDeleted) {
        delete queryFilter.isDeleted;
      }
      const result = (await this.model
        .findOne(queryFilter)
        .populate(populates)) as unknown as T;

      return result ?? null;
    } catch (err) {
      throw this.handleServiceError(err, `FindOne ${this.modelName}`);
    }
  }

  async fineOneWithError(
    filter: FilterQuery<T>,
    populates: { path: string; select?: string }[] = [],
    isDeleted = false,
  ): Promise<T> {
    try {
      const queryFilter: FilterQuery<T> = { ...filter, isDeleted };
      if (isDeleted) {
        delete queryFilter.isDeleted;
      }
      const result = (await this.model
        .findOne(queryFilter)
        .populate(populates)) as unknown as T;

      if (!result) throw new BaseError(Errors.COMMON_NOT_FOUND_ERROR);
      return result;
    } catch (err) {
      throw this.handleServiceError(err, `FindOne ${this.modelName}`);
    }
  }

  async findLastOne(
    populates: { path: string; select?: string }[] = [],
    isDeleted = false,
  ): Promise<Nullable<T>> {
    try {
      const result = (await this.model
        .findOne({ isDeleted } as Record<keyof T, boolean> | any)
        .populate(populates)) as unknown as T;

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
      const result = await this.model.findOneAndUpdate(
        filter,
        { $set: updateInput },
        { new: true },
      );
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
        this.model.findOne(filter),
        this.model.updateMany(
          filter,
          {
            $set: { deletedAt: new Date(), isDeleted: true, deletedBy },
          },
          { new: true },
        ),
      ]);
      if (!foundDocument)
        throw new BadRequestException(`${this.modelName} not found`);
    } catch (err) {
      this.handleServiceError(err, `SoftDelete ${this.modelName}`);
    }
  }

  async delete(filter: Record<keyof T, any> | any): Promise<Nullable<T>> {
    try {
      return (await this.model.findByIdAndDelete(filter)) ?? null;
    } catch (err) {
      throw this.handleServiceError(err, `Delete ${this.modelName}`);
    }
  }

  async count(filter: FilterQuery<T>, isDeleted = false): Promise<number> {
    try {
      return await this.model.countDocuments({ ...filter, isDeleted });
    } catch (err) {
      throw this.handleServiceError(err, `Count ${this.modelName}`);
    }
  }

  async countAggregate(
    filter: FilterQuery<T>,
    pipe: PipelineStage[],
  ): Promise<number> {
    try {
      const result = await this.model.aggregate([
        { $match: filter },
        ...pipe,
        { $count: 'count' },
      ]);
      return result.length > 0 ? result[0].count : 0;
    } catch (err) {
      throw this.handleServiceError(err, `CountAggregate ${this.modelName}`);
    }
  }

  async findAndCount<M = T>(
    filter: FilterQuery<T>,
    paginate: {
      sortField: ESortField;
      sortOrder: ESortOrder;
      offset: number;
      limit: number;
    },
    pipes: any[],
    secondSortField?: ESortField,
  ): Promise<{ items: M[]; total: number }> {
    try {
      const { sortField, sortOrder, offset, limit } = paginate;
      const sortOrderNumber = sortOrder === ESortOrder.DESC ? -1 : 1;
      const secondSort = secondSortField || '_id';

      const [items, total] = await Promise.all([
        this.model.aggregate([
          { $match: filter },
          ...pipes,
          { $sort: { [sortField]: sortOrderNumber, [secondSort]: -1 } },
          { $limit: offset + limit },
          { $skip: offset },
        ]),
        this.countAggregate(filter, pipes),
      ]);

      return { items, total };
    } catch (err) {
      throw this.handleServiceError(err, `Query ${this.modelName}`);
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
