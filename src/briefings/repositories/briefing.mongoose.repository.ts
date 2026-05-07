import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Briefing, BriefingDocument } from '../schemas/briefing.schema';
import { IBriefingRepository } from '../interfaces/briefing.repository.interface';
import { IBriefing } from '../interfaces/briefing.interface';
import { CreateBriefingDto } from '../dto/create-briefing.dto';
import { UpdateBriefingDto } from '../dto/update-briefing.dto';
import { BriefingStatus, TripStyle, TripType } from '../enums/briefing.enum';

type MongoBrf = Briefing & { _id: Types.ObjectId; createdAt: Date; updatedAt: Date };

@Injectable()
export class BriefingMongooseRepository implements IBriefingRepository {
  constructor(
    @InjectModel(Briefing.name) private readonly model: Model<BriefingDocument>,
  ) {}

  private toI(doc: MongoBrf): IBriefing {
    return {
      id: doc._id.toString(),
      agencyId: doc.agencyId?.toString() ?? '',
      viagemId: doc.viagemId?.toString() ?? '',
      passengerId: doc.passengerId?.toString() ?? null,
      status: doc.status as BriefingStatus,
      tripType: doc.tripType as TripType,
      tripStyle: doc.tripStyle as TripStyle,
      destinations: doc.destinations ?? [],
      startDate: doc.startDate ?? null,
      endDate: doc.endDate ?? null,
      totalNights: doc.totalNights ?? null,
      adultCount: doc.adultCount,
      childCount: doc.childCount ?? 0,
      budgetUsd: doc.budgetUsd ?? null,
      notes: doc.notes ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findAll(agencyId: string): Promise<IBriefing[]> {
    const docs = await this.model
      .find({ agencyId: new Types.ObjectId(agencyId) })
      .sort({ createdAt: -1 })
      .lean<MongoBrf[]>();
    return docs.map((d) => this.toI(d));
  }

  async findByViagem(agencyId: string, viagemId: string): Promise<IBriefing[]> {
    const docs = await this.model
      .find({
        agencyId: new Types.ObjectId(agencyId),
        viagemId: new Types.ObjectId(viagemId),
      })
      .sort({ createdAt: -1 })
      .lean<MongoBrf[]>();
    return docs.map((d) => this.toI(d));
  }

  async findById(id: string): Promise<IBriefing | null> {
    const doc = await this.model.findById(id).lean<MongoBrf>();
    return doc ? this.toI(doc) : null;
  }

  async create(dto: CreateBriefingDto & { agencyId: string }): Promise<IBriefing> {
    const created = await this.model.create({
      ...dto,
      agencyId: new Types.ObjectId(dto.agencyId),
      viagemId: new Types.ObjectId(dto.viagemId),
      passengerId: dto.passengerId ? new Types.ObjectId(dto.passengerId) : null,
    });
    const doc = await this.model.findById(created._id).lean<MongoBrf>();
    return this.toI(doc!);
  }

  async update(id: string, dto: UpdateBriefingDto): Promise<IBriefing | null> {
    const doc = await this.model
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .lean<MongoBrf>();
    return doc ? this.toI(doc) : null;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
