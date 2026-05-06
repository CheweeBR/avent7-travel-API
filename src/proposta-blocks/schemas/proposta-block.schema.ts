import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { BlockType } from '../enums/block.enum';

export type PropostaBlockDocument = HydratedDocument<PropostaBlock>;

@Schema({ timestamps: true })
export class PropostaBlock {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Proposta', required: true })
  propostaId: mongoose.Types.ObjectId;

  @Prop({ enum: BlockType, required: true })
  blockType: BlockType;

  @Prop({ required: true, default: 1 })
  dayNumber: number;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: null })
  title: string | null;

  @Prop({ default: null })
  description: string | null;

  @Prop({ default: null })
  imageUrl: string | null;

  @Prop({ default: null })
  locationName: string | null;

  @Prop({ type: Number, default: null })
  costUsd: number | null;

  @Prop({ type: Number, default: null })
  saleUsd: number | null;

  @Prop({ type: Number, default: null })
  markupPct: number | null;

  @Prop({ type: Object, default: null })
  blockData: Record<string, any> | null;

  @Prop({ default: false })
  isConfirmed: boolean;
}

export const PropostaBlockSchema = SchemaFactory.createForClass(PropostaBlock);
PropostaBlockSchema.index({ propostaId: 1, sortOrder: 1 });
