import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { PropostaAiService } from './proposta-ai.service';
import { AiController } from './ai.controller';

@Module({
  providers: [AiService, PropostaAiService],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
