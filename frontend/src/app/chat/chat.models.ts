export type Role = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id?: string;
  role: Role;
  content: string;
  timestamp?: string;
}

export interface PetContext {
  id?: string;
  name?: string;
  species?: string;
  ageMonths?: number;
  weightKg?: number;
  meds?: string[];
  allergies?: string[];
}

export interface StreamChunk {
  content: string;
  done?: boolean;
}
