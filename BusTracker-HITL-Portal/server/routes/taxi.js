const express = require('express');
const axios = require('axios');
const router = express.Router();

function getMoovaConfig() {
	return {
		baseUrl: process.env.MOOVA_API_URL || '',
		token: process.env.MOOVA_API_TOKEN || ''
	};
}

router.post('/request', async (req, res) => {
	const { pickup, destination, passengerName, phone } = req.body || {};
	const { baseUrl, token } = getMoovaConfig();

	if (!pickup) return res.status(400).json({ error: 'pickup is required' });

	if (baseUrl && token) {
		try {
			const resp = await axios.post(`${baseUrl.replace(/\/$/, '')}/rides`, {
				pickup,
				destination,
				passengerName,
				phone
			}, { headers: { Authorization: `Bearer ${token}` } });
			return res.json({ provider: 'moova', result: resp.data });
		} catch (err) {
			console.error('Moová API error:', err.response?.data || err.message);
			// fall through to fallback
		}
	}

	// Fallback mock response
	return res.json({
		provider: 'mock',
		result: {
			request_id: Math.random().toString(36).slice(2),
			eta_minutes: Math.floor(Math.random() * 7) + 3,
			status: 'driver_assigned'
		}
	});
});

module.exports = router;