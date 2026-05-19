import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientSegmentsService } from './client-segments.service';
import { CreateClientSegmentDto } from './dto/create-client-segment.dto';
import { UpdateClientSegmentDto } from './dto/update-client-segment.dto';
import { Auth } from '../common/decorators/auth.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { RequestContextService } from '../common/cls/request-context.service';
import { LogOperation } from '../common/decorators/log-operation.decorator';
import { CURATED_ICON_NAMES } from './constants/curated-icons';

@ApiTags('client-segments')
@ApiBearerAuth()
@Controller('client-segments')
export class ClientSegmentsController {
  constructor(
    private readonly service: ClientSegmentsService,
    private readonly requestContext: RequestContextService,
  ) {}

  @Get('icons')
  @Auth()
  @ApiOperation({ summary: 'List curated icon names available for segments' })
  listIcons() {
    return { icons: CURATED_ICON_NAMES };
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'List segments of the current agency with client counts' })
  findAll() {
    const agencyId = this.requestContext.getAgencyId();
    return this.service.findAllForAgency(agencyId!);
  }

  @Post()
  @Auth(UserRole.ADMIN)
  @LogOperation('create_client_segment')
  @ApiOperation({ summary: 'Create a new client segment' })
  create(@Body() dto: CreateClientSegmentDto) {
    const agencyId = this.requestContext.getAgencyId();
    return this.service.create(dto, agencyId!);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN)
  @LogOperation('update_client_segment')
  @ApiOperation({ summary: 'Update a client segment (name/icon/color propagates to all clients)' })
  update(@Param('id') id: string, @Body() dto: UpdateClientSegmentDto) {
    const agencyId = this.requestContext.getAgencyId();
    return this.service.update(id, dto, agencyId!);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @HttpCode(204)
  @LogOperation('delete_client_segment')
  @ApiOperation({ summary: 'Delete a segment (blocked when clients still reference it)' })
  remove(@Param('id') id: string) {
    const agencyId = this.requestContext.getAgencyId();
    return this.service.remove(id, agencyId!);
  }
}
