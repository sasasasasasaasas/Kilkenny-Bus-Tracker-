import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

export default function App() {
	const location = useLocation()
	return (
		<div className="app-shell">
			<header className="app-header">
				<nav className="nav">
					<Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
					<Link to="/showroom" className={location.pathname.startsWith('/showroom') ? 'active' : ''}>Showroom</Link>
				</nav>
			</header>
			<main className="app-main">
				<Outlet />
			</main>
			<footer className="app-footer">BusTracker HITL Portal</footer>
		</div>
	)
}