export interface Pet {
  id?: number;           // Optional for new pets
  name: string;
  type: string;
  birthday: string;      // ISO date string (e.g., "2022-03-15")
  deceasedDate?: string; // ISO date string (e.g., "2022-03-15")
  breed: string;
}