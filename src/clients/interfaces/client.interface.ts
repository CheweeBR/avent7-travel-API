import { DocumentType, Gender } from '../enums/client.enum';

export interface IPrimaryDocument {
  type: DocumentType;
  number: string;
  country: string;
}

export interface IClientSegmentRef {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface IClient {
  id: string;
  agencyId: string;
  clientCode: string;
  fullName: string;
  socialName: string | null;
  dateOfBirth: Date | null;
  gender: Gender | null;
  nationality: string | null;
  profession: string | null;
  company: string | null;
  segmentId: string;
  segment: IClientSegmentRef | null;
  photoUrl: string | null;
  emailPrimary: string;
  emailSecondary: string | null;
  phonePrimary: string | null;
  phoneAlternative: string | null;
  address: Record<string, string | undefined>;
  emergencyContact: Record<string, string | undefined>;
  primaryDocument: IPrimaryDocument | null;
  travelPreferences: Record<string, any>;
  isActive: boolean;
  tripCount: number;
  passengerCount: number;
  createdAt: Date;
  updatedAt: Date;
}
