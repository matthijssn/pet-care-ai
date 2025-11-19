import { Router } from 'express';
import { readAll, writeAll } from '../storage';
import { Reminder } from '../types';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/reminders?date=YYYY-MM-DD OR ?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get('/', (req, res) => {
  const { date, start, end } = req.query as Record<string, string | undefined>;
  const all = readAll();

  if (date) {
    const d = date;
    const filtered = all.filter(r => (new Date(r.dueAt)).toISOString().slice(0,10) === d);
    return res.json(filtered);
  }

  if (start && end) {
    const s = new Date(start);
    const e = new Date(end);
    const filtered = all.filter(r => {
      const t = new Date(r.dueAt);
      return t >= s && t <= e;
    });
    return res.json(filtered);
  }

  res.json(all);
});

// POST /api/reminders
router.post('/', (req, res) => {
  const body = req.body as Partial<Reminder>;
  if (!body.title || !body.dueAt) return res.status(400).json({ error: 'title and dueAt are required' });

  const all = readAll();
  const now = new Date().toISOString();
  const item: Reminder = {
    id: uuidv4(),
    title: body.title,
    dueAt: body.dueAt,
    petId: body.petId,
    recurrence: body.recurrence || null,
    eventType: body.eventType || 'other',
    createdAt: now,
    updatedAt: undefined
  };
  all.push(item);
  writeAll(all);
  res.status(201).json(item);
});

// PUT /api/reminders/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const body = req.body as Partial<Reminder>;
  const all = readAll();
  const idx = all.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });

  const existing = all[idx];
  const updated: Reminder = {
    ...existing,
    title: body.title ?? existing.title,
    dueAt: body.dueAt ?? existing.dueAt,
    petId: body.petId ?? existing.petId,
    recurrence: body.recurrence ?? existing.recurrence,
    eventType: body.eventType ?? existing.eventType,
    updatedAt: new Date().toISOString()
  };

  all[idx] = updated;
  writeAll(all);
  res.json(updated);
});

// DELETE /api/reminders/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const all = readAll();
  const idx = all.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const removed = all.splice(idx, 1)[0];
  writeAll(all);
  res.json(removed);
});

export default router;
