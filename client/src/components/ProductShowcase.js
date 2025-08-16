import React from 'react';

const products = Array.from({ length: 25 }).map((_, i) => ({
	id: i + 1,
	title: `Product ${i + 1}`,
	price: ((i + 1) * 1.99).toFixed(2),
	link: `https://example.com/order/${i + 1}`
}));

export default function ProductShowcase() {
	return (
		<div className="product-grid">
			{products.map((p) => (
				<a key={p.id} href={p.link} target="_blank" rel="noreferrer" className="product">
					<div className="title">{p.title}</div>
					<div className="price">€{p.price}</div>
				</a>
			))}
		</div>
	);
}