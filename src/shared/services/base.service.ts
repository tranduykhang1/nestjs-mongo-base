import { BadRequestException, Logger } from '@nestjs/common';
import { HydratedDocument } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-mongoose-plugin';
import { appConfig } from 'src/app.config';
import { BaseEntity } from '../entity/base-object.entity';
import { ESortField, ESortOrder } from '../enum/sort.enum';
import { joinUser } from '../pipelines/join-user';
import { BaseResponse } from '../responses/base.response';

export abstract class BaseService<T extends BaseEntity> {
  private readonly modelName: string;
  private readonly serviceLogger = new Logger(BaseService.name);

  constructor(private readonly model: SoftDeleteModel<HydratedDocument<T>>) {
    if (appConfig.env !== 'test') {
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

  async create(
    input: Partial<Record<keyof T, unknown>>,
    userId: string,
  ): Promise<T> {
    try {
      const createInput = {
        ...input,
        createdBy: userId,
      };
      const createdData = await this.model.create(createInput);
      if (createdData) return createdData;
      throw new BadRequestException(
        `CREATE_FAIL_FOR_${this.modelName.toLowerCase()}`,
      );
    } catch (err) {
      this.serviceLogger.error(`Create failed ${this.modelName}:`);
      this.serviceLogger.error(err);
      if (err.code === 11000) {
        throw new BadRequestException(
          `${Object.keys(err.keyValue).toString()} is existed`,
        );
      }
      throw new BadRequestException(err);
    }
  }

  async findOne(filter: Record<keyof T, any> | any): Promise<T | null> {
    let result: any;
    try {
      result = await this.model.findOne(filter);

      if (result) {
        return result;
      }

      throw new BadRequestException(`${this.modelName} not found`);
    } catch (err) {
      this.serviceLogger.error(`Could not find ${this.modelName}`);
      this.serviceLogger.error(err);
      throw new BadRequestException(`${this.modelName} not found`);
    }
  }

  async findLastOne(): Promise<T> {
    return await this.model.findOne().sort({ $natural: -1 });
  }

  async findDeleted(filter: Record<keyof T, any> | any): Promise<T> {
    return await this.model.findOne({
      ...filter,
      isDeleted: true,
    });
  }

  async findWithoutError(
    filter: Record<keyof T, any> | any,
  ): Promise<T | null> {
    const result = await this.model.findOne(filter);
    return result;
  }
  async findIncludeField(pipe: string | any, field?: string): Promise<T> {
    try {
      const result = await this.model.findOne(pipe).select(field);
      return result;
    } catch (err) {
      this.serviceLogger.error(
        `COULD_NOT_FIND_${this.modelName.toUpperCase()}`,
      );
      this.serviceLogger.error(err);
      throw new BadRequestException(`${this.modelName} not found`);
    }
  }
  async update(
    filter: Record<keyof T, any> | any,
    input: Partial<Record<keyof T, unknown>>,
    userId: string,
    pipes = [],
  ): Promise<T> {
    try {
      const updateInput = {
        ...input,
        updatedBy: userId,
      };

      await this.findOne(filter);
      await this.model.findByIdAndUpdate(
        filter,
        {
          $set: updateInput,
        },

        { new: true },
      );
      const [res] = await this.queryAggregate(
        [filter],
        { limit: 1, offset: 0 },
        pipes,
      );
      return res;
    } catch (err) {
      this.serviceLogger.error(`Could not find ${this.modelName} entry:`);
      this.serviceLogger.error({ err });
      if (err.code === 11000) {
        throw new BadRequestException(
          `The ${Object.keys(err.keyValue)
            .toString()
            .toUpperCase()} is existed`,
        );
      }
      throw new BadRequestException(`${this.modelName} not found`);
    }
  }

  async remove(
    filter: Record<keyof T, any> | any,
    userId: string,
  ): Promise<BaseResponse<T>> {
    try {
      await this.findOne(filter);
      await this.model.updateMany(
        filter,
        {
          $set: {
            deletedBy: userId,
          },
        },
        { new: true },
      );
      await this.model.softDeleteOne(filter);
      return;
    } catch (err) {
      this.serviceLogger.error(`Could not find ${this.modelName} entry:`);
      this.serviceLogger.error(err);
      throw new BadRequestException(`${this.modelName} not found`);
    }
  }

  async removeMany(
    filter: Record<keyof T, any> | any,
    userId: string,
  ): Promise<BaseResponse<T>> {
    try {
      await this.model.updateMany(
        filter,
        {
          $set: {
            deletedBy: userId,
          },
        },
        { new: true },
      );
      const { matchedCount } = await this.model.softDeleteMany(filter);
      let res: BaseResponse<T> = {
        statusCode: 200,
        message: 'success',
      };
      if (matchedCount === 0) {
        throw new BadRequestException('remove failed');
      } else {
        res = {
          message: 'success',
        };
      }
      return res;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(filter: Record<keyof T, any> | any): Promise<T> {
    try {
      return await this.model.findByIdAndDelete(filter);
    } catch (err) {
      return err;
    }
  }

  async count(filter: any): Promise<number> {
    const result: number = await this.model.count({ $and: filter });
    return result || 0;
  }

  async countAggregate(filter: any, pipe = []): Promise<number> {
    const [result] = await this.model.aggregate([
      {
        $match: {
          $and: filter,
        },
      },
      ...joinUser('createdBy'),
      ...joinUser('updatedBy'),
      ...pipe,
      { $count: 'count' },
    ]);
    return result ? result.count : 0;
  }

  async queryAggregate(
    filter: any,
    paginate: any,
    pipes: any[],
    secondSortField?: ESortField,
  ): Promise<T[]> {
    const { sortField, sortOrder, offset, limit } = paginate;
    let secondSort = '_id';
    const sortOrderNumber = sortOrder === ESortOrder.DESC ? -1 : 1;
    if (secondSortField) {
      secondSort = secondSortField;
    }

    const result = await this.model.aggregate([
      {
        $match: { $and: filter },
      },
      ...joinUser('createdBy'),
      ...joinUser('updatedBy'),
      ...pipes,
      {
        $project: {
          password: 0,
          key: 0,
        },
      },
      {
        $sort: {
          [sortField]: sortOrderNumber,
          [secondSort]: -1,
        },
      },
      {
        $limit: offset + limit,
      },
      {
        $skip: offset,
      },
    ]);
    return result;
  }
  async queryAggregatePaginateFirst(
    filter: any,
    paginate: any,
    pipes: any[],
  ): Promise<T[]> {
    const { offset, limit, sortField, sortOrder } = paginate;

    const sortOrderNumber = sortOrder === ESortOrder.DESC ? -1 : 1;
    const result = await this.model.aggregate([
      {
        $match: { $and: filter },
      },

      {
        $sort: {
          [sortField]: sortOrderNumber,
          _id: -1,
        },
      },

      {
        $limit: offset + limit,
      },
      {
        $skip: offset,
      },
      ...pipes,
      ...joinUser('createdBy'),
      ...joinUser('updatedBy'),
      {
        $project: {
          password: 0,
          key: 0,
        },
      },
    ]);
    return result;
  }

  async baseQuery(
    filter: any,
    {
      sortField = ESortField.CREATED_AT,
      sortOrder = ESortOrder.DESC,
      offset = 0,
      limit = 99999 * 99999,
    }: any,
  ): Promise<T[] | any> {
    const sortOrderNumber = sortOrder === ESortOrder.DESC ? -1 : 1;
    const result: T[] = await this.model.aggregate([
      { $match: { $and: filter } },
      ...joinUser('createdBy'),
      ...joinUser('updatedBy'),
      // {
      //   $project: {
      //     userId: 0,
      //     ownerId: 0,
      //     password: 0,
      //     key: 0,
      //   },
      // },
      {
        $sort: { [sortField]: sortOrderNumber, _id: 1 },
      },
      {
        $limit: offset + limit,
      },
      {
        $skip: offset,
      },
    ]);
    return result;
  }

  async checkOwner(id: string, userId: string): Promise<void> {
    const isOwner = await this.model.findOne({
      _id: id,
      createdBy: userId,
    });
    if (!isOwner) {
      throw new BadRequestException('not owner');
    }
    return;
  }

  async permanentRemove(date: Date): Promise<any> {
    try {
      const { deletedCount } = await this.model.deleteMany(
        {
          $lte: date,
          isDeleted: true,
        },
        {
          rawResult: true,
        },
      );

      this.serviceLogger.log(':::::::::::::::::::::::::::::::::');
      this.serviceLogger.log(`DELETED: ${deletedCount} in ${this.modelName}`);
      return deletedCount;
    } catch (err) {
      this.serviceLogger.warn('CLEAN UP THE REMOVED DATA:::');
      this.serviceLogger.warn(err.message);
    }
  }
}
