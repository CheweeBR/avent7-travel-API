import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Proposta, PropostaSchema } from './schemas/proposta.schema';
import { PropostasService } from './propostas.service';
import { PropostasController } from './propostas.controller';
import { PropostaMongooseRepository } from './repositories/proposta.mongoose.repository';
import { PROPOSTA_REPOSITORY } from './interfaces/proposta.repository.interface';

@Module({
  imports: [MongooseModule.forFeature([{ name: Proposta.name, schema: PropostaSchema }])],
  controllers: [PropostasController],
  providers: [
    PropostasService,
    { provide: PROPOSTA_REPOSITORY, useClass: PropostaMongooseRepository },
  ],
  exports: [PropostasService],
})
export class PropostasModule {}
