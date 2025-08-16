import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

function useInterval(callback, delay) {
	useEffect(() => {
		if (delay == null) return
		const id = setInterval(callback, delay)
		return () => clearInterval(id)
	}, [callback, delay])
}

export default function AdsPanel() {
	const [ads, setAds] = useState([])
	const [idx, setIdx] = useState(0)
	const [notes, setNotes] = useState([])

	useEffect(() => {
		axios.get('/api/ads').then(r => setAds(r.data))
		axios.get('/api/notes?type=note').then(r => setNotes(r.data))
	}, [])

	useInterval(() => {
		if (ads.length > 0) {
			const next = (idx + 1) % ads.length
			setIdx(next)
			axios.post(`/api/ads/${ads[next].id}/view`).catch(() => {})
		}
	}, 7000)

	const current = useMemo(() => (ads.length ? ads[idx] : null), [ads, idx])

	return (
		<div className="card">
			<h3>Rotating Ads</h3>
			{current ? (
				<a href={current.linkUrl} target="_blank" rel="noreferrer" className="ad-card">
					<img src={current.imageUrl} alt={current.title} />
					<div className="ad-title">{current.title}</div>
				</a>
			) : (
				<p>No ads available</p>
			)}
			<div className="notes">
				<h4>Local Notes</h4>
				<ul>
					{notes.slice(0, 4).map(n => (
						<li key={n.id}>{n.message}</li>
					))}
				</ul>
			</div>
		</div>
	)
}