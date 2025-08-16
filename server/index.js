import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Deals: store as HTML fragments in server data dir
const dataDir = path.join(__dirname, 'data');
const dealsPath = path.join(dataDir, 'deals.html');
const logPath = path.join(dataDir, 'log.txt');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

app.get('/deals', (req, res) => {
	if (fs.existsSync(dealsPath)) {
		const html = fs.readFileSync(dealsPath, 'utf8');
		res.type('html').send(html);
		return;
	}
	res.type('html').send('');
});

app.post('/deals', (req, res) => {
	const dealRaw = (req.body?.deal || '').toString().trim();
	if (!dealRaw) return res.status(400).json({ error: 'deal required' });
	const sanitized = dealRaw.replace(/[<>]/g, '');
	const fragment = `<div class="deal">${sanitized}</div>\n`;
	fs.appendFileSync(dealsPath, fragment, 'utf8');
	return res.json({ ok: true });
});

app.post('/events', (req, res) => {
	const { timestamp, event } = req.body || {};
	if (!timestamp || !event) return res.status(400).json({ error: 'bad payload' });
	const line = `${new Date().toISOString()} — ${event} — ${timestamp}\n`;
	fs.appendFileSync(logPath, line, 'utf8');
	return res.json({ ok: true });
});

app.post('/taxi/request', (req, res) => {
	return res.json({ message: 'Taxi requested (mock)' });
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(port, () => {
	console.log(`API listening on http://localhost:${port}`);
});