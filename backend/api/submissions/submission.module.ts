import { Module } from '@nestjs/common';
import { SubmittedArticleController } from './submission.controller';
import { SubmittedArticleService } from './submission.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Submitted_Article,
  SubmittedArticleSchema,
} from './submitted_article.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submitted_Article.name, schema: SubmittedArticleSchema },
    ]),
  ],
  controllers: [SubmittedArticleController],
  providers: [SubmittedArticleService],
})
export class SubmissionModule {}
