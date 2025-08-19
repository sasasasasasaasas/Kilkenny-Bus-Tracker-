
import React, { useState, useEffect } from 'react';
import './styles/global.css';
import BusMap from './components/BusMap';
import AdsPanel from './components/AdsPanel';
import TaxiButton from './components/TaxiButton';
import LiveStream from './components/LiveStream';
import ProductShowcase from './components/ProductShowcase';
import ProductFeedback from './components/ProductFeedback';
import LostFound from './components/LostFound';
import PaymentSystem from './components/PaymentSystem';

function App() {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied');
        }
      );
    }
  }, []);

  return (
    <div className="app">
      {/* Modern Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <div className="brand-icon">🚌</div>
            <div className="brand-text">
              <h1>Kilkenny Bus Tracker</h1>
              <span className="brand-subtitle">Blocksmith Studio Portal</span>
            </div>
          </div>
          <div className="header-status">
            <div className="status-indicator live"></div>
            <span>Live System</span>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="dashboard-grid">
        {/* Left Column - Bus Map (Always Visible) */}
        <section className="map-section">
          <div className="section-card">
            <div className="card-header">
              <h2>🗺️ Live Bus Tracking</h2>
              <div className="status-badge">Active</div>
            </div>
            <BusMap userLocation={userLocation} />
          </div>
        </section>

        {/* Center Column - Video Stream (Always Visible) */}
        <section className="stream-section">
          <div className="section-card">
            <div className="card-header">
              <h2>📹 Studio Live Stream</h2>
              <div className="status-badge streaming">Streaming</div>
            </div>
            <LiveStream />
          </div>
        </section>

        {/* Right Column - Ads & Actions */}
        <section className="sidebar-section">
          {/* Rolling Ads Panel */}
          <div className="section-card ads-card">
            <div className="card-header">
              <h2>🎯 Featured Offers</h2>
            </div>
            <AdsPanel />
          </div>

          {/* Quick Actions */}
          <div className="section-card actions-card">
            <div className="card-header">
              <h2>⚡ Quick Actions</h2>
            </div>
            <div className="action-buttons">
              <TaxiButton />
              <button className="action-btn emergency">
                🚨 Emergency Contact
              </button>
              <button className="action-btn info">
                ℹ️ Route Information
              </button>
            </div>
          </div>

          {/* Lost & Found */}
          <div className="section-card community-card">
            <div className="card-header">
              <h2>📋 Community Board</h2>
            </div>
            <LostFound />
          </div>
        </section>

        {/* Bottom Section - Products & Services */}
        <section className="products-section">
          <div className="section-card full-width">
            <div className="card-header">
              <h2>🛍️ Transit Marketplace</h2>
              <span className="section-subtitle">Local products and services</span>
            </div>
            <ProductShowcase />
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Kilkenny Transit</h4>
            <p>Smart city transportation solutions</p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>support@kilkennytransit.ie</p>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <button className="gdpr-btn">GDPR Settings</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
