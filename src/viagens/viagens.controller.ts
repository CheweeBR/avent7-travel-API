import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ViagensService } from './viagens.service';
import { CreateViagemDto } from './dto/create-viagem.dto';
import { UpdateViagemDto } from './dto/update-viagem.dto';
import { ViagemQueryDto } from './dto/viagem-query.dto';
import { Auth } from '../common/decorators/auth.decorator';
import { RequestContextService } from '../common/cls/request-context.service';
import { LogOperation } from '../common/decorators/log-operation.decorator';

@ApiTags('viagens')
@ApiBearerAuth()
@Controller('viagens')
export class ViagensController {
  constructor(
    private readonly viagensService: ViagensService,
    private readonly requestContext: RequestContextService,
  ) {}

  @Get()
  @Auth()
  @ApiOperation({ summary: 'List viagens (paginated)' })
  findAll(@Query() query: ViagemQueryDto) {
    const agencyId = this.requestContext.getAgencyId();
    return this.viagensService.findPaged(agencyId!, query);
  }

  @Get('all')
  @Auth()
  @ApiOperation({ summary: 'List all viagens without pagination (for pipeline/kanban)' })
  findAllUnpaged() {
    const agencyId = this.requestContext.getAgencyId();
    return this.viagensService.findAll(agencyId!);
  }

  @Get(':id')
  @Auth()
  @ApiOperation({ summary: 'Get viagem by id' })
  findOne(@Param('id') id: string) {
    return this.viagensService.findById(id);
  }

  @Post()
  @Auth()
  @LogOperation('create_viagem')
  @ApiOperation({ summary: 'Create a new viagem' })
  create(@Body() dto: CreateViagemDto) {
    const agencyId = this.requestContext.getAgencyId();
    const userId = this.requestContext.getUserId();
    return this.viagensService.create(dto, agencyId!, userId);
  }

  @Patch(':id')
  @Auth()
  @LogOperation('update_viagem')
  @ApiOperation({ summary: 'Update viagem' })
  update(@Param('id') id: string, @Body() dto: UpdateViagemDto) {
    return this.viagensService.update(id, dto);
  }

  @Post(':id/cover')
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload viagem cover image' })
  uploadCover(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.viagensService.uploadCover(id, file);
  }

  @Delete(':id')
  @Auth()
  @HttpCode(204)
  @LogOperation('delete_viagem')
  @ApiOperation({ summary: 'Delete viagem' })
  remove(@Param('id') id: string) {
    return this.viagensService.remove(id);
  }
}
