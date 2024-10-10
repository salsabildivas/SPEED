import { Injectable } from '@nestjs/common';
import { Rejected_Article } from './rejected_articles.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRejectedDto } from './create-rejected-article.dto';

@Injectable()
export class RejectedArticleService {
  constructor(
    @InjectModel(Rejected_Article.name)
    private rejectedArticleModel: Model<Rejected_Article>,
  ) {}

  test(): string {
    return 'rejected article route testing';
  }
  async findAll(): Promise<Rejected_Article[]> {
    return await this.rejectedArticleModel.find().exec();
  }
  async findOne(id: string): Promise<Rejected_Article> {
    return await this.rejectedArticleModel.findById(id).exec();
  }
  async create(createRejectedDto: CreateRejectedDto) {
    return await this.rejectedArticleModel.create(createRejectedDto);
  }
  async update(id: string, createRejectedDto: CreateRejectedDto) {
    return await this.rejectedArticleModel
      .findByIdAndUpdate(id, createRejectedDto, { new: true })
      .exec();
  }
  async deleteRejected(id: string) {
    const deletedRejected = await this.rejectedArticleModel
      .findByIdAndDelete(id)
      .exec();
    return deletedRejected;
  }
}
