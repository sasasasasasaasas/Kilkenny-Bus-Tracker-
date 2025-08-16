const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const router = express.Router();

const DATA_DIR = path.join(__dirname, '..', 'data');
const ADS_PATH = path.join(DATA_DIR, 'ads.json');

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

// Initialize with some defaults if empty
async function initAdsIfEmpty() {
	const existing = await readJsonArray(ADS_PATH);
	if (existing.length === 0) {
		const defaults = [
			{ id: newId(), title: 'Local Coffee', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=60&auto=format&fit=crop', linkUrl: 'https://example.com/coffee', views: 0 },
			{ id: newId(), title: 'City Museum', imageUrl: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1200&q=60&auto=format&fit=crop', linkUrl: 'https://example.com/museum', views: 0 },
			{ id: newId(), title: 'Gym Membership', imageUrl: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=1200&q=60&auto=format&fit=crop', linkUrl: 'https://example.com/gym', views: 0 }
		];
		await writeJson(ADS_PATH, defaults);
	}
}

router.get('/', async (req, res) => {
	await initAdsIfEmpty();
	const ads = await readJsonArray(ADS_PATH);
	res.json(ads);
});

router.post('/', async (req, res) => {
	const ads = await readJsonArray(ADS_PATH);
	const { title, imageUrl, linkUrl, startAt, endAt, tags } = req.body;
	const ad = { id: newId(), title, imageUrl, linkUrl, startAt, endAt, tags, views: 0 };
	ads.push(ad);
	await writeJson(ADS_PATH, ads);
	res.status(201).json(ad);
});

router.put('/:id', async (req, res) => {
	const ads = await readJsonArray(ADS_PATH);
	const idx = ads.findIndex(a => a.id === req.params.id);
	if (idx === -1) return res.status(404).json({ error: 'Not found' });
	ads[idx] = { ...ads[idx], ...req.body, id: ads[idx].id };
	await writeJson(ADS_PATH, ads);
	res.json(ads[idx]);
});

router.delete('/:id', async (req, res) => {
	const ads = await readJsonArray(ADS_PATH);
	const next = ads.filter(a => a.id !== req.params.id);
	if (next.length === ads.length) return res.status(404).json({ error: 'Not found' });
	await writeJson(ADS_PATH, next);
	res.status(204).send();
});

router.post('/:id/view', async (req, res) => {
	const ads = await readJsonArray(ADS_PATH);
	const a = ads.find(x => x.id === req.params.id);
	if (!a) return res.status(404).json({ error: 'Not found' });
	a.views = (a.views || 0) + 1;
	await writeJson(ADS_PATH, ads);
	res.json({ ok: true, views: a.views });
});

router.get('/random', async (req, res) => {
	const ads = await readJsonArray(ADS_PATH);
	if (ads.length === 0) return res.status(404).json({ error: 'No ads' });
	const idx = Math.floor(Math.random() * ads.length);
	res.json(ads[idx]);
});

module.exports = router;