import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';
import internal from 'stream';
export type ArticleDocument = HydratedDocument<Submitted_Article>;
@Schema()
/*Title, authors, journal name, year of publication, volume, number, pages, DOI, status   */

export class Submitted_Article {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  author: string;
  @Prop({ required: true })
  journal_name: string;
  @Prop()
  description: string;
  @Prop()
  published_year: string;
  @Prop()
  volume_number: string;
  @Prop()
  pages: number;
  @Prop({ required: true })
  status: string;
  @Prop()
  submitter: string;
}
export const ArticleSchema = SchemaFactory.createForClass(Submitted_Article);
