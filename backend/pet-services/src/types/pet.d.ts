export interface Pet {
  ownerId: string;
  name: string;
  species: string;
  breed?: string;
  birthday?: string;
  weightKg?: number;
  color?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
