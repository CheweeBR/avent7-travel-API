import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropostaBlock, PropostaBlockSchema } from './schemas/proposta-block.schema';
import { PropostaBlocksService } from './proposta-blocks.service';
import { PropostaBlocksController } from './proposta-blocks.controller';
import { PropostaBlockMongooseRepository } from './repositories/proposta-block.mongoose.repository';
import { PROPOSTA_BLOCK_REPOSITORY } from './interfaces/proposta-block.repository.interface';

@Module({
  imports: [MongooseModule.forFeature([{ name: PropostaBlock.name, schema: PropostaBlockSchema }])],
  controllers: [PropostaBlocksController],
  providers: [
    PropostaBlocksService,
    { provide: PROPOSTA_BLOCK_REPOSITORY, useClass: PropostaBlockMongooseRepository },
  ],
  exports: [PropostaBlocksService],
})
export class PropostaBlocksModule {}
