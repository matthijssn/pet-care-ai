import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import remindersRouter from './routes/reminders.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/reminders', remindersRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const port = Number(process.env.PORT || 4002);
app.listen(port, () => console.log(`Reminders service listening on ${port}`));
