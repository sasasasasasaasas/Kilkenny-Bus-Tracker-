const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const { analyzeEventForAnomaly } = require('../utils/security');
const router = express.Router();

const DATA_DIR = path.join(__dirname, '..', 'data');
const HITL_PATH = path.join(DATA_DIR, 'hitl.json');

async function ensureDataDir() {
	await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson(filePath, fallback) {
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

async function initState() {
	const state = await readJson(HITL_PATH, null);
	if (!state) {
		const fresh = { status: 'ok', incidents: [], updatedAt: new Date().toISOString() };
		await writeJson(HITL_PATH, fresh);
		return fresh;
	}
	return state;
}

router.get('/status', async (req, res) => {
	const state = await initState();
	res.json(state);
});

router.post('/incident', async (req, res) => {
	const state = await initState();
	const event = req.body || {};
	const analysis = analyzeEventForAnomaly(event);
	const incident = {
		id: Math.random().toString(36).slice(2, 10),
		type: event.type || 'event',
		severity: analysis.severity,
		message: event.message || 'Unspecified',
		meta: { ...event.meta, analysis },
		createdAt: new Date().toISOString()
	};
	state.incidents.unshift(incident);
	state.status = analysis.severity >= 7 ? 'alert' : 'ok';
	state.updatedAt = new Date().toISOString();
	await writeJson(HITL_PATH, state);
	res.status(201).json(incident);
});

router.delete('/incident/:id', async (req, res) => {
	const state = await initState();
	const before = state.incidents.length;
	state.incidents = state.incidents.filter(i => i.id !== req.params.id);
	if (state.incidents.length === before) return res.status(404).json({ error: 'Not found' });
	state.updatedAt = new Date().toISOString();
	await writeJson(HITL_PATH, state);
	res.status(204).send();
});

module.exports = router;