export interface Pet {
  id?: number;           // Optional for new pets
  name: string;
  species: string;       // Changed from 'type' to 'species'
  birthday?: string;     // ISO date string (e.g., "2022-03-15")
  breed?: string;
  weight?: number;       // Weight in kg
  color?: string;        // Color/pattern for fish and other pets
  notes?: string;        // Additional notes
  deceasedDate?: string; // ISO date string (e.g., "2022-03-15")
}

// For backwards compatibility, maintain type as alias
export type PetType = Pet;