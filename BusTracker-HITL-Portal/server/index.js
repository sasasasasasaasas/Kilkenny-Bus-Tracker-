const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

// Load env from config/dev.env or config/prod.env
const envFilePath = path.join(__dirname, '..', 'config', process.env.NODE_ENV === 'production' ? 'prod.env' : 'dev.env');
require('dotenv').config({ path: envFilePath });

const app = express();
app.use(cors());
app.use(express.json());

const API_PREFIX = '/api';

// Routes
app.use(`${API_PREFIX}/ads`, require('./routes/ads'));
app.use(`${API_PREFIX}/products`, require('./routes/products'));
app.use(`${API_PREFIX}/taxi`, require('./routes/taxi'));
app.use(`${API_PREFIX}/hitl`, require('./routes/hitl'));
app.use(`${API_PREFIX}/notes`, require('./routes/notes'));

// Stream embed helper
const { getLiveStreamEmbedUrl } = require('./utils/stream');
app.get(`${API_PREFIX}/stream/embed`, (req, res) => {
	try {
		const url = getLiveStreamEmbedUrl();
		res.json({ embedUrl: url });
	} catch (err) {
		res.status(500).json({ error: 'Failed to load stream embed URL' });
	}
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Serve built client in production
if (process.env.NODE_ENV === 'production') {
	const distPath = path.join(__dirname, '..', 'client', 'dist');
	if (fs.existsSync(distPath)) {
		app.use(express.static(distPath));
		app.get('*', (req, res) => {
			res.sendFile(path.join(distPath, 'index.html'));
		});
	}
}

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
	console.log(`API server listening on http://localhost:${PORT}`);
});