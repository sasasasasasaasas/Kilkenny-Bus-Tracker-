import React from 'react'
import BusMap from '../components/BusMap'
import LiveStream from '../components/LiveStream'
import AdsPanel from '../components/AdsPanel'
import LostFound from '../components/LostFound'
import TaxiButton from '../components/TaxiButton'
import ProductShowcase from '../components/ProductShowcase'

export default function Home() {
	return (
		<div className="dashboard">
			{/* Header Stats */}
			<div className="stats-grid">
				<div className="stat-card">
					<h4>Active Buses</h4>
					<div className="stat-value">12</div>
				</div>
				<div className="stat-card">
					<h4>On-Time Rate</h4>
					<div className="stat-value">94%</div>
				</div>
				<div className="stat-card">
					<h4>Passengers Today</h4>
					<div className="stat-value">2,847</div>
				</div>
				<div className="stat-card">
					<h4>System Status</h4>
					<div className="stat-value status-good">ONLINE</div>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="main-grid">
				<div className="section primary">
					<BusMap />
				</div>
				<div className="section secondary">
					<LiveStream />
				</div>
				<div className="section tertiary">
					<AdsPanel />
				</div>
				<div className="section quaternary">
					<div className="action-panel">
						<TaxiButton />
						<LostFound />
					</div>
				</div>
			</div>

			{/* Products Section */}
			<div className="products-section">
				<h2>Transit Marketplace</h2>
				<ProductShowcase />
			</div>
		</div>
	)
}