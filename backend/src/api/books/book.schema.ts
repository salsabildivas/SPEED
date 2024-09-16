import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';
export type BookDocument = HydratedDocument<Book>;
@Schema()
export class Book {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  isbn: string;
  @Prop({ required: true })
  author: string;
  @Prop()
  description: string;
  @Prop({ type: Date })
  published_date: Date;
  @Prop()
  publisher: string;
  @Prop({ type: Date, default: Date.now })
  updated_date: Date;
}
export const BookSchema = SchemaFactory.createForClass(Book);
