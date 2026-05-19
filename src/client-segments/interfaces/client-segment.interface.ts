export interface IClientSegment {
  id: string;
  agencyId: string;
  name: string;
  icon: string;
  color: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClientSegmentWithCount extends IClientSegment {
  clientsCount: number;
}
