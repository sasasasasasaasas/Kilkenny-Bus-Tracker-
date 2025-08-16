import React from 'react'
import BusMap from '../components/BusMap'
import LiveStream from '../components/LiveStream'
import AdsPanel from '../components/AdsPanel'
import LostFound from '../components/LostFound'
import TaxiButton from '../components/TaxiButton'

export default function Home() {
	return (
		<div className="layout">
			<section className="col">
				<BusMap />
				<LiveStream />
			</section>
			<section className="col">
				<AdsPanel />
				<LostFound />
				<TaxiButton />
			</section>
		</div>
	)
}