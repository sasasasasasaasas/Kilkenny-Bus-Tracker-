import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Showroom from './pages/Showroom'
import './styles/global.css'

const root = createRoot(document.getElementById('root'))
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />}> 
					<Route index element={<Home />} />
					<Route path="showroom" element={<Showroom />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
)