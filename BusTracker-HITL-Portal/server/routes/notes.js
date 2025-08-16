const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const router = express.Router();

const DATA_DIR = path.join(__dirname, '..', 'data');
const NOTES_PATH = path.join(DATA_DIR, 'notes.json');

async function ensureDataDir() {
	await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJsonArray(filePath, fallback = []) {
	try {
		const buf = await fs.readFile(filePath, 'utf-8');
		return JSON.parse(buf);
	} catch (e) {
		return fallback;
	}
}

async function writeJson(filePath, data) {
	await ensureDataDir();
	await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

function newId() {
	return Math.random().toString(36).slice(2, 10);
}

router.get('/', async (req, res) => {
	const type = req.query.type;
	const notes = await readJsonArray(NOTES_PATH);
	const filtered = type ? notes.filter(n => n.type === type) : notes;
	res.json(filtered);
});

router.post('/', async (req, res) => {
	const notes = await readJsonArray(NOTES_PATH);
	const { type = 'note', message, contact } = req.body || {};
	if (!message) return res.status(400).json({ error: 'message is required' });
	const note = {
		id: newId(),
		type,
		message,
		contact,
		createdAt: new Date().toISOString()
	};
	notes.unshift(note);
	await writeJson(NOTES_PATH, notes);
	res.status(201).json(note);
});

router.delete('/:id', async (req, res) => {
	const notes = await readJsonArray(NOTES_PATH);
	const next = notes.filter(n => n.id !== req.params.id);
	if (next.length === notes.length) return res.status(404).json({ error: 'Not found' });
	await writeJson(NOTES_PATH, next);
	res.status(204).send();
});

module.exports = router;