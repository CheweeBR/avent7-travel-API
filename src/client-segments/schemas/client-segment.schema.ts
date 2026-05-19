import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type ClientSegmentDocument = HydratedDocument<ClientSegment>;

@Schema({ timestamps: true, collection: 'clientsegments' })
export class ClientSegment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true, index: true })
  agencyId: mongoose.Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ default: 'var(--muted)' })
  color: string;

  @Prop({ default: 0 })
  order: number;
}

export const ClientSegmentSchema = SchemaFactory.createForClass(ClientSegment);
ClientSegmentSchema.index({ agencyId: 1, name: 1 }, { unique: true });
