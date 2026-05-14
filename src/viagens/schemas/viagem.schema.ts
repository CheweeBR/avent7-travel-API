import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { ViagemStatus } from '../enums/viagem.enum';

export type ViagemDocument = HydratedDocument<Viagem>;

@Schema({ timestamps: true })
export class Viagem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true })
  agencyId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true })
  clientId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Passenger', default: null })
  passengerId: mongoose.Types.ObjectId | null;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  createdByUserId: mongoose.Types.ObjectId | null;

  @Prop({ required: true, unique: true, trim: true })
  viagemCode: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ enum: ViagemStatus, default: ViagemStatus.DRAFT })
  status: ViagemStatus;

  @Prop({ type: String, default: null })
  coverImageUrl: string | null;
}

export const ViagemSchema = SchemaFactory.createForClass(Viagem);
ViagemSchema.index({ agencyId: 1 });
ViagemSchema.index({ clientId: 1 });
ViagemSchema.index({ status: 1 });
ViagemSchema.index({ createdByUserId: 1 });
