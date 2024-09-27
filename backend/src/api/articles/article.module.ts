import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Published_Article, PublishedArticleSchema } from './published_articles.schema';
import { Submitted_Article, ArticleSchema } from './submitted_article.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Published_Article.name, schema: PublishedArticleSchema }, {name : Submitted_Article.name, schema: ArticleSchema}]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class BookModule {}
