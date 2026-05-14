import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Auth } from '../common/decorators/auth.decorator';
import { PropostaAiService } from './proposta-ai.service';
import { MensagemBreveDto } from './dto/mensagem-breve.dto';
import { SugerirBlocoDto } from './dto/sugerir-bloco.dto';
import { SugerirAtividadesDiaDto } from './dto/sugerir-atividades-dia.dto';

@ApiTags('ai')
@ApiBearerAuth()
@Controller('ai')
export class AiController {
  constructor(private readonly propostaAiService: PropostaAiService) {}

  @Post('proposta/mensagem-breve')
  @Auth()
  @HttpCode(200)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({ summary: 'Gera uma mensagem breve personalizada para a proposta' })
  gerarMensagemBreve(@Body() dto: MensagemBreveDto) {
    return this.propostaAiService.gerarMensagemBreve(dto);
  }

  @Post('proposta/mensagem-breve/stream')
  @Auth()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({ summary: 'Gera mensagem breve via SSE streaming' })
  gerarMensagemBreveStream(@Body() dto: MensagemBreveDto, @Res() res: Response) {
    return this.propostaAiService.gerarMensagemBreveStream(dto, res);
  }

  @Post('proposta/sugerir-bloco')
  @Auth()
  @HttpCode(200)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Sugere dados reais (web search) para pré-preencher um bloco da proposta' })
  sugerirBloco(@Body() dto: SugerirBlocoDto) {
    return this.propostaAiService.sugerirBloco(dto);
  }

  @Post('proposta/sugerir-atividades-dia')
  @Auth()
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Sugere múltiplas atividades (web search) para um dia completo da proposta' })
  sugerirAtividadesDia(@Body() dto: SugerirAtividadesDiaDto) {
    return this.propostaAiService.sugerirAtividadesDia(dto);
  }
}
