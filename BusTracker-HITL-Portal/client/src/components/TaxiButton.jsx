import React, { useState } from 'react'
import axios from 'axios'

export default function TaxiButton() {
	const [loading, setLoading] = useState(false)
	const [result, setResult] = useState(null)

	const requestTaxi = async () => {
		setLoading(true)
		try {
			const resp = await axios.post('/api/taxi/request', {
				pickup: { lat: 19.076, lng: 72.8777 },
				destination: { lat: 19.1, lng: 72.9 },
				passengerName: 'Showroom',
				phone: '000-000'
			})
			setResult(resp.data)
		} catch (e) {
			setResult({ error: 'Failed to request taxi' })
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="card">
			<h3>Taxi</h3>
			<button onClick={requestTaxi} disabled={loading}>{loading ? 'Requesting…' : 'Call Taxi'}</button>
			{result && (
				<pre className="pre">{JSON.stringify(result, null, 2)}</pre>
			)}
		</div>
	)
}