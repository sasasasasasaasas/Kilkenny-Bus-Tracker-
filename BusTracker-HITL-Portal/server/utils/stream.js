const path = require('path');
const fs = require('fs');

function getLiveStreamEmbedUrl() {
	const configPath = path.join(__dirname, '..', '..', 'config', 'stream_keys.json');
	let cfg = null;
	if (fs.existsSync(configPath)) {
		try {
			cfg = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
		} catch (e) {
			// ignore
		}
	}
	const provider = (cfg && cfg.provider) || 'youtube';
	const id = (cfg && cfg.stream_id) || 'dQw4w9WgXcQ';
	switch (provider) {
		case 'twitch':
			return `https://player.twitch.tv/?channel=${encodeURIComponent(id)}&parent=localhost`;
		case 'youtube':
		default:
			return `https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&mute=1`;
	}
}

module.exports = { getLiveStreamEmbedUrl };