import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function LostFound() {
	const [items, setItems] = useState([])
	const [message, setMessage] = useState('')
	const [contact, setContact] = useState('')

	const load = () => axios.get('/api/notes?type=lostfound').then(r => setItems(r.data))

	useEffect(() => { load() }, [])

	const submit = async (e) => {
		e.preventDefault()
		if (!message) return
		await axios.post('/api/notes', { type: 'lostfound', message, contact })
		setMessage(''); setContact('');
		load()
	}

	return (
		<div className="card">
			<h3>Lost & Found</h3>
			<form className="inline-form" onSubmit={submit}>
				<input placeholder="Item or note" value={message} onChange={e => setMessage(e.target.value)} />
				<input placeholder="Contact (optional)" value={contact} onChange={e => setContact(e.target.value)} />
				<button type="submit">Post</button>
			</form>
			<ul className="list">
				{items.map(i => (
					<li key={i.id}>{i.message} {i.contact ? `— ${i.contact}` : ''}</li>
				))}
			</ul>
		</div>
	)
}