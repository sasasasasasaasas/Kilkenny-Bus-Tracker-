import React, { useState } from 'react';

export default function TaxiButton() {
	const [status, setStatus] = useState('');
	const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';

	const callTaxi = async () => {
		setStatus('Requesting...');
		const res = await fetch(`${apiBase}/taxi/request`, { method: 'POST' });
		const data = await res.json();
		setStatus(data.message || 'Requested');
	};

	return (
		<div>
			<button onClick={callTaxi}>Call Taxi</button>
			<div>{status}</div>
		</div>
	);
}