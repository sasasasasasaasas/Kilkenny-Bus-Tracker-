import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function LiveStream() {
	const [embedUrl, setEmbedUrl] = useState('')
	useEffect(() => {
		axios.get('/api/stream/embed').then(r => setEmbedUrl(r.data.embedUrl)).catch(() => setEmbedUrl(''))
	}, [])
	return (
		<div className="card">
			<h3>Showroom Live Stream</h3>
			<div className="embed-container">
				{embedUrl ? (
					<iframe title="Live Stream" src={embedUrl} allow="autoplay" allowFullScreen></iframe>
				) : (
					<p>Stream unavailable</p>
				)}
			</div>
		</div>
	)
}