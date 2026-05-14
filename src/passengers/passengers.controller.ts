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
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PassengersService } from './passengers.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { Auth } from '../common/decorators/auth.decorator';
import { RequestContextService } from '../common/cls/request-context.service';
import { LogOperation } from '../common/decorators/log-operation.decorator';

@ApiTags('passengers')
@ApiBearerAuth()
@Controller('passengers')
export class PassengersController {
  constructor(
    private readonly passengersService: PassengersService,
    private readonly requestContext: RequestContextService,
  ) {}

  @Get()
  @Auth()
  @ApiQuery({ name: 'clientId', required: true })
  @ApiOperation({ summary: 'List passengers of a client' })
  findByClientId(@Query('clientId') clientId: string) {
    return this.passengersService.findByClientId(clientId);
  }

  @Get(':id')
  @Auth()
  @ApiOperation({ summary: 'Get passenger by id' })
  findOne(@Param('id') id: string) {
    return this.passengersService.findById(id);
  }

  @Post()
  @Auth()
  @LogOperation('create_passenger')
  @ApiOperation({ summary: 'Create a passenger linked to a client' })
  create(@Body() dto: CreatePassengerDto) {
    const agencyId = this.requestContext.getAgencyId();
    return this.passengersService.create(dto, agencyId!);
  }

  @Patch(':id')
  @Auth()
  @LogOperation('update_passenger')
  @ApiOperation({ summary: 'Update passenger' })
  update(@Param('id') id: string, @Body() dto: UpdatePassengerDto) {
    return this.passengersService.update(id, dto);
  }

  @Post(':id/photo')
  @Auth()
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiOperation({ summary: 'Upload passenger photo' })
  uploadPhoto(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.passengersService.uploadPhoto(id, file);
  }

  @Delete(':id')
  @Auth()
  @HttpCode(204)
  @LogOperation('delete_passenger')
  @ApiOperation({ summary: 'Delete passenger' })
  remove(@Param('id') id: string) {
    return this.passengersService.remove(id);
  }
}
