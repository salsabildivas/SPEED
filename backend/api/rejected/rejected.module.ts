import { Module } from '@nestjs/common';
import { RejectedArticleController } from './rejected.controller';
import { RejectedArticleService } from './rejected.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Rejected_Article,
  RejectedArticleSchema,
} from './rejected_articles.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rejected_Article.name, schema: RejectedArticleSchema },
    ]),
  ],
  controllers: [RejectedArticleController],
  providers: [RejectedArticleService],
})
export class RejectedModule {}
