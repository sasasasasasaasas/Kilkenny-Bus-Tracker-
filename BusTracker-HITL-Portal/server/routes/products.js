const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const QRCode = require('qrcode');
const router = express.Router();

const DATA_DIR = path.join(__dirname, '..', 'data');
const PRODUCTS_PATH = path.join(DATA_DIR, 'products.json');

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

function buildDefaultProducts() {
	const arr = [];
	for (let i = 1; i <= 25; i++) {
		arr.push({
			id: newId(),
			sku: `SKU-${1000 + i}`,
			title: `Product ${i}`,
			description: `Great product number ${i}.`,
			price: Number((Math.random() * 90 + 10).toFixed(2)),
			imageUrl: `https://picsum.photos/seed/product${i}/400/300`,
			orderLink: `https://example.com/order?sku=${1000 + i}`
		});
	}
	return arr;
}

async function initProductsIfEmpty() {
	const existing = await readJsonArray(PRODUCTS_PATH);
	if (existing.length === 0) {
		const defaults = buildDefaultProducts();
		await writeJson(PRODUCTS_PATH, defaults);
	}
}

router.get('/', async (req, res) => {
	await initProductsIfEmpty();
	const products = await readJsonArray(PRODUCTS_PATH);
	res.json(products);
});

router.get('/:id', async (req, res) => {
	const products = await readJsonArray(PRODUCTS_PATH);
	const p = products.find(x => x.id === req.params.id);
	if (!p) return res.status(404).json({ error: 'Not found' });
	res.json(p);
});

router.post('/', async (req, res) => {
	const products = await readJsonArray(PRODUCTS_PATH);
	const { sku, title, description, price, imageUrl, orderLink } = req.body;
	const p = { id: newId(), sku, title, description, price, imageUrl, orderLink };
	products.push(p);
	await writeJson(PRODUCTS_PATH, products);
	res.status(201).json(p);
});

router.get('/:id/qr', async (req, res) => {
	const products = await readJsonArray(PRODUCTS_PATH);
	const p = products.find(x => x.id === req.params.id);
	if (!p) return res.status(404).json({ error: 'Not found' });
	const orderUrl = p.orderLink || `https://example.com/order?sku=${encodeURIComponent(p.sku)}`;
	try {
		const pngBuffer = await QRCode.toBuffer(orderUrl, { type: 'png', width: 256, margin: 1 });
		res.setHeader('Content-Type', 'image/png');
		res.send(pngBuffer);
	} catch (e) {
		res.status(500).json({ error: 'QR generation failed' });
	}
});

module.exports = router;