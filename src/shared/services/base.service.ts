import { BadRequestException, Logger } from '@nestjs/common';
import { HydratedDocument } from 'mongoose';
import { ESortField, ESortOrder } from '../enum/sort.enum';
import { BaseResponse } from '../responses/base.response';
import { BaseObject } from '../schemas/base-object.schema';
import { SoftDeleteModel } from 'soft-delete-mongoose-plugin';
import { joinUser } from '../pipelines/join-user';
import { appConfig } from 'src/app.config';

export abstract class BaseService<T extends BaseObject> {
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
        throw new BadRequestException([
          `${Object.keys(err.keyValue).toString().toUpperCase()}_IS_EXISTED`,
        ]);
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

      throw new BadRequestException([
        `${this.modelName.toUpperCase()}_NOT_FOUND`,
      ]);
    } catch (err) {
      this.serviceLogger.error(`Could not find ${this.modelName}`);
      this.serviceLogger.error(err);
      throw new BadRequestException([
        `${this.modelName.toUpperCase()}_NOT_FOUND!`,
      ]);
    }
  }

  async findLastOne(): Promise<T> {
    return await this.model.findOne().sort({ $natural: -1 });
  }

  async findDeleted(value: string, customField: string): Promise<T> {
    return await this.model.findOne({
      [customField]: value,
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
      throw new BadRequestException([
        `${this.modelName.toUpperCase()}_NOT_FOUND`,
      ]);
    }
  }
  async update(
    id: string,
    input: Partial<Record<keyof T, unknown>>,
    userId: string,
    upsert = false,
  ): Promise<T> {
    try {
      const updateInput = {
        ...input,
        updatedBy: userId,
      };

      await this.findOne({ _id: id });
      return await this.model.findByIdAndUpdate(
        id,
        {
          $set: updateInput,
        },

        { new: true, upsert },
      );
    } catch (err) {
      this.serviceLogger.error(`Could not find ${this.modelName} entry:`);
      this.serviceLogger.error({ err });
      if (err.code === 11000) {
        throw new BadRequestException([
          `The ${Object.keys(err.keyValue)
            .toString()
            .toUpperCase()}_IS_EXISTED!`,
        ]);
      }
      throw new BadRequestException([
        `${this.modelName.toUpperCase()}_NOT_FOUND`,
      ]);
    }
  }

  async remove(
    id: string,
    userId: string,
    customField?: string,
  ): Promise<BaseResponse<T>> {
    try {
      let condition: any = { _id: id };
      if (customField) {
        condition = { [customField]: id };
      }
      await this.model.updateMany(
        condition,
        {
          $set: {
            deletedBy: userId,
          },
        },
        { new: true },
      );
      await this.model.softDeleteOne(condition);
      const res: BaseResponse<T> = {
        statusCode: 200,
        message: 'Success',
      };
      return res;
    } catch (err) {
      this.serviceLogger.error(`Could not find ${this.modelName} entry:`);
      this.serviceLogger.error(err);
      throw new BadRequestException([
        `${this.modelName.toUpperCase()}_NOT_FOUND`,
      ]);
    }
  }

  async removeMany(ids: string[], userId: string): Promise<BaseResponse<T>> {
    try {
      const condition = { _id: { $in: ids } };
      await this.model.updateMany(
        condition,
        {
          $set: {
            deletedBy: userId,
          },
        },
        { new: true },
      );
      const { matchedCount } = await this.model.softDeleteMany(condition);
      let res: BaseResponse<T> = {
        statusCode: 200,
        message: 'SUCCESS',
      };
      if (matchedCount === 0) {
        throw new BadRequestException('FAILED');
      } else {
        res = {
          statusCode: 200,
          message: 'SUCCESS',
        };
      }
      return res;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(id: string): Promise<T> {
    try {
      return await this.model.findByIdAndDelete(id);
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
    const { sortBy, sortOrder, offset, limit } = paginate;
    let secondSort = '_id';
    const sortOrderNumber = sortOrder === ESortOrder.DESC ? -1 : 1;
    if (secondSortField) {
      secondSort = secondSortField;
    }

    const result = await this.model.aggregate([
      {
        $match: { $and: filter },
      },
      ...pipes,
      ...joinUser('createdBy'),
      ...joinUser('updatedBy'),
      {
        $sort: {
          [sortBy]: sortOrderNumber,
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
    const { offset, limit, sortBy, sortOrder } = paginate;

    const sortOrderNumber = sortOrder === ESortOrder.DESC ? -1 : 1;
    const result = await this.model.aggregate([
      {
        $match: { $and: filter },
      },

      {
        $sort: {
          [sortBy]: sortOrderNumber,
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
    ]);
    return result;
  }

  async baseQuery(
    filter: any,
    { sortBy, sortOrder, offset, limit }: any,
  ): Promise<T[] | any> {
    const result: T[] = await this.model
      .aggregate([
        { $match: { $and: filter } },
        ...joinUser('createdBy'),
        ...joinUser('updatedBy'),
      ])
      .sort({ [sortBy]: sortOrder, _id: 1 })
      .skip(offset)
      .limit(limit);
    return result;
  }

  async checkOwner(id: string, userId: string): Promise<void> {
    const isOwner = await this.model.findOne({
      _id: id,
      createdBy: userId,
    });
    if (!isOwner) {
      throw new BadRequestException('NOT_OWNER');
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
