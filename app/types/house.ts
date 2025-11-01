export interface House {
  ownerUid: string;
  title: string;
  description: string;
  trickPersona: string;
  treatsAvailable: string;
  isActive: boolean;
  createdAt: number;
  lat?: number;
  lng?: number;
}