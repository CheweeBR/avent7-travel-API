import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientSegment, ClientSegmentSchema } from './schemas/client-segment.schema';
import { Client, ClientSchema } from '../clients/schemas/client.schema';
import { ClientSegmentsService } from './client-segments.service';
import { ClientSegmentsController } from './client-segments.controller';
import { ClientSegmentMongooseRepository } from './repositories/client-segment.mongoose.repository';
import { CLIENT_SEGMENT_REPOSITORY } from './interfaces/client-segment.repository.interface';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClientSegment.name, schema: ClientSegmentSchema },
      { name: Client.name, schema: ClientSchema },
    ]),
  ],
  controllers: [ClientSegmentsController],
  providers: [
    ClientSegmentsService,
    { provide: CLIENT_SEGMENT_REPOSITORY, useClass: ClientSegmentMongooseRepository },
  ],
  exports: [ClientSegmentsService],
})
export class ClientSegmentsModule {}
