import { BadRequestException, Logger } from '@nestjs/common';
import { HydratedDocument, PipelineStage } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-mongoose-plugin';
import { appConfig } from 'src/app.config';
import { BaseEntity } from '../entity/base-object.entity';
import { ESortField, ESortOrder } from '../enum/sort.enum';
import { Nullable } from 'src/common/types/types';

export abstract class BaseService<T extends BaseEntity> {
  private readonly modelName: string;
  private readonly serviceLogger = new Logger(BaseService.name);

  constructor(private readonly model: SoftDeleteModel<HydratedDocument<T>>) {
    this.modelName = appConfig.env !== 'test' ? model.modelName : 'TestModel';
  }

  async create(
    input: Partial<Record<keyof T, unknown>>,
    userId: string,
  ): Promise<T> {
    try {
      const createInput = { ...input, createdBy: userId };
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

  async findOne(filter: Record<keyof T, any> | any): Promise<Nullable<T>> {
    try {
      const result = await this.model.findOne(filter);
      return result ?? null;
    } catch (err) {
      throw this.handleServiceError(err, `FindOne ${this.modelName}`);
    }
  }

  async findLastOne(): Promise<Nullable<T>> {
    try {
      return (await this.model.findOne().sort({ $natural: -1 })) ?? null;
    } catch (err) {
      throw this.handleServiceError(err, `FindLastOne ${this.modelName}`);
    }
  }

  async update(
    filter: Record<keyof T, any> | any,
    input: Partial<Record<keyof T, unknown>>,
    userId: string,
  ): Promise<Nullable<T>> {
    try {
      const updateInput = { ...input, updatedBy: userId };
      const result = await this.model.findByIdAndUpdate(
        filter,
        { $set: updateInput },
        { new: true },
      );
      if (!result) throw new BadRequestException(`${this.modelName} not found`);
      return result;
    } catch (err) {
      throw this.handleServiceError(err, `Update ${this.modelName}`);
    }
  }

  async softDelete(
    filter: Record<keyof T, any> | any,
    userId: string,
  ): Promise<void> {
    try {
      const [foundDocument] = await Promise.all([
        this.model.findOne(filter),
        this.model.updateMany(
          filter,
          { $set: { deletedBy: userId } },
          { new: true },
        ),
        this.model.softDeleteOne(filter),
      ]);
      if (!foundDocument)
        throw new BadRequestException(`${this.modelName} not found`);
    } catch (err) {
      this.handleServiceError(err, `SoftDelete ${this.modelName}`);
    }
  }

  async softDeleteMany(
    filter: Record<keyof T, any> | any,
    userId: string,
  ): Promise<void> {
    try {
      const { matchedCount } = await this.model.updateMany(
        filter,
        { $set: { deletedBy: userId } },
        { new: true },
      );
      if (matchedCount === 0) throw new BadRequestException('remove failed');
    } catch (err) {
      this.handleServiceError(err, `SoftDeleteMany ${this.modelName}`);
    }
  }

  async delete(filter: Record<keyof T, any> | any): Promise<Nullable<T>> {
    try {
      return (await this.model.findByIdAndDelete(filter)) ?? null;
    } catch (err) {
      throw this.handleServiceError(err, `Delete ${this.modelName}`);
    }
  }

  async count(filter: any): Promise<number> {
    try {
      return await this.model.countDocuments({ $and: filter });
    } catch (err) {
      throw this.handleServiceError(err, `Count ${this.modelName}`);
    }
  }

  async countAggregate(filter: any, pipe: PipelineStage[]): Promise<number> {
    try {
      const result = await this.model.aggregate([
        { $match: { $and: filter } },
        ...pipe,
        { $count: 'count' },
      ]);
      return result.length > 0 ? result[0].count : 0;
    } catch (err) {
      throw this.handleServiceError(err, `CountAggregate ${this.modelName}`);
    }
  }

  async query<M = T>(
    filter: any,
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
          { $match: { $and: filter } },
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
    throw new BadRequestException(
      `${operation} failed for ${this.modelName}: ${err.message}`,
    );
  }
}
