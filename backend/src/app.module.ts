import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from '../src/api/articles/article.module';
import { SubmissionModule } from '../src/api/submissions/submission.module';
import { RejectedModule } from '../src/api/rejected/rejected.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URI),
    ArticleModule,
    SubmissionModule,
    RejectedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
