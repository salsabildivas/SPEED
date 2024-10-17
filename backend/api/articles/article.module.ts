import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Published_Article,
  PublishedArticleSchema,
} from './published_articles.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Published_Article.name, schema: PublishedArticleSchema },
    ]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
