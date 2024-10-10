import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type RejectedArticleDocument = HydratedDocument<Rejected_Article>;
@Schema()
/*Title, Authors, journal name, publish year, volume, number, pages, DOI, SE practice, claim, stance(for/against), type of research, type of participant    */
export class Rejected_Article {
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
  @Prop()
  DOI: string;
}
export const RejectedArticleSchema =
  SchemaFactory.createForClass(Rejected_Article);
