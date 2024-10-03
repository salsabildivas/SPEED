import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';
import internal from 'stream';
export type PublishedArticleDocument = HydratedDocument<Published_Article>;
@Schema()
/*Title, Authors, journal name, publish year, volume, number, pages, DOI, SE practice, claim, stance(for/against), type of research, type of participant    */
export class Published_Article {
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
  @Prop({ required: true })
  SE_practice: string;
  @Prop()
  claim: string;
  @Prop()
  evidence: string;
  @Prop()
  type_of_research: string;
  @Prop()
  type_of_participant: string;
}
export const PublishedArticleSchema =
  SchemaFactory.createForClass(Published_Article);
