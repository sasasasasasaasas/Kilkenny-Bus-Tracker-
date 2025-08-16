const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function apiGet(path, opts = {}) {
	const res = await fetch(`${API_BASE}${path}`, opts);
	if (!res.ok) throw new Error(`GET ${path} failed`);
	return res.json();
}

export async function apiPost(path, body, opts = {}) {
	const res = await fetch(`${API_BASE}${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
		body: JSON.stringify(body)
	});
	if (!res.ok) throw new Error(`POST ${path} failed`);
	return res.json();
}