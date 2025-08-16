import React, { useEffect } from 'react';
import BusMap from '../components/BusMap.js';
import LiveStream from '../components/LiveStream.js';
import AdsPanel from '../components/AdsPanel.js';

export default function Home() {
	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/events`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ timestamp: Date.now(), event: 'pageview' })
		});
	}, []);

	return (
		<div className="home-grid">
			<div className="map">
				<BusMap />
			</div>
			<aside className="sidebar">
				<LiveStream />
				<AdsPanel />
			</aside>
		</div>
	);
}