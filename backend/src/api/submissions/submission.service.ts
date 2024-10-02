import { Injectable } from '@nestjs/common';
import { Submitted_Article } from './submitted_article.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSubmittedDto } from './create-submitted-article.dto';

@Injectable()
export class SubmittedArticleService {
  constructor(@InjectModel(Submitted_Article.name) private submittedArticleModel: Model<Submitted_Article>) {}
  
  test(): string {
    return 'book route testing';
  }
  async findAll(): Promise<Submitted_Article[]> {
    return await this.submittedArticleModel.find().exec();
  }
  async findOne(id: string): Promise<Submitted_Article> {
    return await this.submittedArticleModel.findById(id).exec();
  }
  async create(createSubmittedDto: CreateSubmittedDto) {
    return await this.submittedArticleModel.create(createSubmittedDto);
  }
  async update(id: string, createSubmittedDto: CreateSubmittedDto) {
    return await this.submittedArticleModel.findByIdAndUpdate(id, createSubmittedDto).exec();
  }
  async deleteSubmitted(id: string) {
    const deletedSubmitted = await this.submittedArticleModel.findByIdAndDelete(id).exec();
    return deletedSubmitted;
  }

}