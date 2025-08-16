import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.js';
import Showroom from './pages/Showroom.js';

export default function App() {
	return (
		<BrowserRouter>
			<header className="app-header">
				<nav>
					<Link to="/">Home</Link>
					<Link to="/showroom">Showroom</Link>
				</nav>
			</header>
			<main>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/showroom" element={<Showroom />} />
				</Routes>
			</main>
		</BrowserRouter>
	);
}