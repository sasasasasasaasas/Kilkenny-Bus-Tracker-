import React from 'react';

export default function LiveStream() {
	const hlsUrl = import.meta.env.VITE_HLS_URL || '';
	return (
		<div className="live-stream">
			<h3>Showroom Live</h3>
			{hlsUrl ? (
				<video controls src={hlsUrl} style={{ width: '100%' }} />
			) : (
				<p>Configure VITE_HLS_URL to enable live playback.</p>
			)}
		</div>
	);
}