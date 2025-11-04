export interface ReminderEvent {
  type: 'reminder.created';
  reminderId: string;
  userId: string;
  petId?: string;
  title: string;
  dueAt: string;
}