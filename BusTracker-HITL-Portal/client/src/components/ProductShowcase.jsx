import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ProductShowcase() {
	const [products, setProducts] = useState([])

	useEffect(() => {
		axios.get('/api/products').then(r => setProducts(r.data))
	}, [])

	return (
		<div className="card">
			<h3>Product Showcase</h3>
			<div className="grid products">
				{products.map(p => (
					<div className="product" key={p.id}>
						<img className="product-img" src={p.imageUrl} alt={p.title} />
						<div className="product-info">
							<div className="product-title">{p.title}</div>
							<div className="product-price">${p.price.toFixed(2)}</div>
						</div>
						<div className="product-actions">
							<a className="btn" href={p.orderLink} target="_blank" rel="noreferrer">Order</a>
							<img className="qr" src={`/api/products/${p.id}/qr`} alt="QR" />
						</div>
					</div>
				))}
			</div>
		</div>
	)
}