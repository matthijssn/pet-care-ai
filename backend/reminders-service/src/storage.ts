import fs from 'fs';
import path from 'path';
import { Reminder } from './types';

const DATA_FILE = path.join(__dirname, '..', 'data', 'reminders.json');

function ensureDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

export function readAll(): Reminder[] {
  try {
    ensureDir();
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw) as Reminder[];
  } catch (e) {
    return [];
  }
}

export function writeAll(items: Reminder[]) {
  ensureDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}
