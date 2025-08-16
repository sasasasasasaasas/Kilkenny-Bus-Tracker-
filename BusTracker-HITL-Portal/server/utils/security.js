function analyzeEventForAnomaly(event) {
	const message = event?.message || '';
	const type = event?.type || 'event';
	let severity = 3;
	if (/theft|fight|weapon|smoke|fire/i.test(message) || /critical|high/i.test(event?.level)) {
		severity = 8;
	} else if (/suspicious|loiter|trespass/i.test(message)) {
		severity = 6;
	}
	return { type, severity, keywords: message.split(/\s+/).slice(0, 5) };
}

module.exports = { analyzeEventForAnomaly };