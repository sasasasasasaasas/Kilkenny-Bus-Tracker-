import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

export default function App() {
	const location = useLocation()
	return (
		<div className="app-shell">
			<header className="app-header">
				<div className="header-content">
					<div className="logo">
						<h1>🚌 BusTracker HITL Portal</h1>
						<span className="subtitle">Human-in-the-Loop Transit Management</span>
					</div>
					<nav className="nav">
						<Link to="/" className={location.pathname === '/' ? 'active' : ''}>Dashboard</Link>
						<div className="status-indicator">
							<span className="status-dot"></span>
							System Active
						</div>
					</nav>
				</div>
			</header>
			<main className="app-main">
				<Outlet />
			</main>
			<footer className="app-footer">
				<div className="footer-content">
					<span>© 2024 BusTracker HITL Portal</span>
					<span>Real-time Transit Intelligence</span>
				</div>
			</footer>
		</div>
	)
}