import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { PropostaStatus } from '../enums/proposta.enum';

export type PropostaDocument = HydratedDocument<Proposta>;

@Schema({ timestamps: true })
export class Proposta {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true })
  agencyId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Viagem', required: true })
  viagemId: mongoose.Types.ObjectId;

  @Prop({ required: true, unique: true, trim: true })
  propostaCode: string;

  @Prop({ default: null })
  title: string | null;

  @Prop({ enum: PropostaStatus, default: PropostaStatus.DRAFT })
  status: PropostaStatus;

  @Prop({ default: null })
  startDate: Date | null;

  @Prop({ default: null })
  endDate: Date | null;

  @Prop({ default: null })
  totalNights: number | null;

  @Prop({ default: 0 })
  totalCostUsd: number;

  @Prop({ default: 0 })
  totalSaleUsd: number;

  @Prop({ default: 0 })
  totalMarkupUsd: number;

  @Prop({ default: 0 })
  platformFeeUsd: number;

  @Prop({ default: 0 })
  agencyProfitUsd: number;

  @Prop({ default: null })
  heroImageUrl: string | null;

  @Prop({ default: null })
  clientMessage: string | null;

  @Prop({ default: null })
  sentToClientAt: Date | null;

  @Prop({ default: null })
  approvedAt: Date | null;

  @Prop({ default: null })
  bookedAt: Date | null;
}

export const PropostaSchema = SchemaFactory.createForClass(Proposta);
PropostaSchema.index({ agencyId: 1 });
PropostaSchema.index({ viagemId: 1 });
PropostaSchema.index({ status: 1 });
