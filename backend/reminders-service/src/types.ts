export interface Reminder {
  id: string;
  title: string;
  dueAt: string; // ISO
  petId?: string;
  recurrence?: string | null;
  eventType?: string;
  createdAt: string;
  updatedAt?: string;
}
