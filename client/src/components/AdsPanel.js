import React, { useEffect, useState } from 'react';

export default function AdsPanel() {
	const [dealsHtml, setDealsHtml] = useState('');
	const [deal, setDeal] = useState('');
	const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';

	const refresh = async () => {
		const res = await fetch(`${apiBase}/deals`, { headers: { 'Accept': 'text/html' } });
		const text = await res.text();
		setDealsHtml(text);
	};

	useEffect(() => {
		refresh();
	}, []);

	const submit = async (e) => {
		e.preventDefault();
		if (!deal.trim()) return;
		await fetch(`${apiBase}/deals`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ deal })
		});
		setDeal('');
		refresh();
	};

	return (
		<div className="ads-panel">
			<h3>Live Deals Along Route</h3>
			<div dangerouslySetInnerHTML={{ __html: dealsHtml }} />
			<form onSubmit={submit}>
				<input value={deal} onChange={(e) => setDeal(e.target.value)} placeholder="Add your local offer..." />
				<button type="submit">Submit Deal</button>
			</form>
		</div>
	);
}