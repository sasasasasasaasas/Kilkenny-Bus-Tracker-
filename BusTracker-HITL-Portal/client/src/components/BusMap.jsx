import React from 'react'

export default function BusMap() {
	const mapUrl = 'https://www.openstreetmap.org/export/embed.html?bbox=72.0%2C18.8%2C73.2%2C19.4&layer=mapnik'
	return (
		<div className="card">
			<h3>Live Bus Map</h3>
			<div className="embed-container">
				<iframe title="Bus Map" src={mapUrl} allowFullScreen></iframe>
			</div>
		</div>
	)
}