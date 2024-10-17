import { Injectable } from '@nestjs/common';
import { Published_Article } from './published_articles.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateArticleDto } from './create-published-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Published_Article.name)
    private articleModel: Model<Published_Article>,
  ) {}

  test(): string {
    return 'book route testing';
  }
  async findAll(): Promise<Published_Article[]> {
    return await this.articleModel.find().exec();
  }
  async findOne(id: string): Promise<Published_Article> {
    return await this.articleModel.findById(id).exec();
  }
  async create(createArticleDto: CreateArticleDto) {
    return await this.articleModel.create(createArticleDto);
  }
  async update(id: string, createArticleDto: CreateArticleDto) {
    return await this.articleModel
      .findByIdAndUpdate(id, createArticleDto, { new: true })
      .exec();
  }
  async deleteArticle(id: string) {
    const deletedArticle = await this.articleModel.findByIdAndDelete(id).exec();
    return deletedArticle;
  }
}
