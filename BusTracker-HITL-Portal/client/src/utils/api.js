import axios from 'axios'

export async function apiGet(path) {
	const res = await axios.get(path)
	return res.data
}

export async function apiPost(path, body) {
	const res = await axios.post(path, body)
	return res.data
}