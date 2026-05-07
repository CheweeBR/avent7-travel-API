import { ViagemStatus } from '../enums/viagem.enum';

export interface IViagem {
  id: string;
  agencyId: string;
  clientId: string;
  passengerId: string | null;
  createdByUserId: string | null;
  viagemCode: string;
  title: string;
  status: ViagemStatus;
  createdAt: Date;
  updatedAt: Date;
}
