import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { appConfig } from 'src/app.config';
import { SORT_FIELD, SORT_ORDER } from '../enums/sort.enum';
import { Nullable } from 'src/common/types/common.type';

export class BaseRepository<T> {
  private readonly modelName: string;

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

  async create(input: FilterQuery<T>): Promise<T> {
    return await this.model.create(input);
  }

  async findOne(
    filter: FilterQuery<T>,
    populates: { path: string; select?: string }[] = [],
  ): Promise<Nullable<T>> {
    const result = await this.model.findOne(filter).populate(populates);

    return (result as T) ?? null;
  }

  async findLastOne(
    filter: FilterQuery<T> = {},
    populates: { path: string; select?: string }[] = [],
  ): Promise<Nullable<T>> {
    const result = await this.model
      .find(filter)
      .sort({ $natural: 1 })
      .limit(1)
      .populate(populates);

    return result.length > 0 ? result[0] : null;
  }

  async update(
    filter: FilterQuery<T>,
    input: Partial<Record<keyof T, unknown>>,
  ): Promise<Nullable<T>> {
    const result = await this.model.findOneAndUpdate(
      filter,
      { $set: input },
      { new: true },
    );
    return result;
  }

  async updateMany(
    filter: FilterQuery<T>,
    input: Record<string, any>,
  ): Promise<any> {
    return await this.model.updateMany(filter, { $set: input }, { new: true });
  }

  async delete(filter: Record<keyof T, any> | any): Promise<Nullable<T>> {
    return (await this.model.findByIdAndDelete(filter)) ?? null;
  }

  async count(filter: FilterQuery<T>): Promise<number> {
    return await this.model.countDocuments({ ...filter });
  }

  async countAggregate(
    filter: FilterQuery<T>,
    pipe: PipelineStage[],
  ): Promise<number> {
    const result = await this.model.aggregate([
      { $match: filter },
      ...pipe,
      { $count: 'count' },
    ]);
    return result.length > 0 ? result[0].count : 0;
  }

  async findAndCount<M = T>(
    filter: FilterQuery<T>,
    paginate: {
      sortField: SORT_FIELD;
      sortOrder: SORT_ORDER;
      offset: number;
      limit: number;
    },
    pipes: any[],
    secondSortField?: SORT_FIELD,
  ): Promise<{ items: M[]; total: number }> {
    const { sortField, sortOrder, offset, limit } = paginate;
    const sortOrderNumber = sortOrder === SORT_ORDER.DESC ? -1 : 1;
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
  }
}
