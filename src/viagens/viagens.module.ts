import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Viagem, ViagemSchema } from './schemas/viagem.schema';
import { ViagensService } from './viagens.service';
import { ViagensController } from './viagens.controller';
import { ViagemMongooseRepository } from './repositories/viagem.mongoose.repository';
import { VIAGEM_REPOSITORY } from './interfaces/viagem.repository.interface';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Viagem.name, schema: ViagemSchema }]), ClientsModule],
  controllers: [ViagensController],
  providers: [
    ViagensService,
    { provide: VIAGEM_REPOSITORY, useClass: ViagemMongooseRepository },
  ],
  exports: [ViagensService],
})
export class ViagensModule {}
