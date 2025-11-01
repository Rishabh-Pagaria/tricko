export interface TreatRequest {
  id?: string;
  houseId: string;
  trickerId: string;
  ownerId: string;
  status: 'pending' | 'approved' | 'denied';
  createdAt: number;
  processedAt?: number;
  houseTitle: string;
  trickerEmail: string;
}