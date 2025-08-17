
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
  const [activeTab, setActiveTab] = useState('bus-tracker');
  const [notifications, setNotifications] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get user location for local services
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log('Location access denied')
      );
    }
  }, []);

  const tabs = [
    { id: 'bus-tracker', label: '🚌 Bus Tracker', icon: '🚌' },
    { id: 'shop', label: '🛍️ Local Shop', icon: '🛍️' },
    { id: 'services', label: '🚖 Services', icon: '🚖' },
    { id: 'community', label: '📋 Community', icon: '📋' },
    { id: 'live-stream', label: '📺 Live Stream', icon: '📺' }
  ];

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>🚌 Kilkenny Bus Tracker Portal</h1>
          <p>Your Local Hub for Transport, Shopping & Community</p>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="tab-navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {activeTab === 'bus-tracker' && (
          <div className="bus-tracker-section">
            <div className="section-header">
              <h2>🚌 Real-Time Bus Tracking</h2>
              <p>Track buses in real-time around Kilkenny</p>
            </div>
            <BusMap userLocation={userLocation} />
            
            {/* Quick Actions for Bus Users */}
            <div className="quick-actions">
              <button className="action-btn primary">
                📍 Find Nearest Stop
              </button>
              <button className="action-btn secondary">
                ⏰ Set Bus Alert
              </button>
              <button className="action-btn secondary">
                📱 Get Route Info
              </button>
            </div>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="shop-section">
            <div className="section-header">
              <h2>🛍️ Local Shop & Products</h2>
              <p>Discover trending products and local deals</p>
            </div>
            
            <div className="shop-grid">
              <div className="shop-main">
                <ProductShowcase />
              </div>
              
              <div className="shop-sidebar">
                <div className="feedback-section">
                  <h3>💡 Suggest Products</h3>
                  <ProductFeedback />
                </div>
                
                <div className="payment-section">
                  <h3>💳 Quick Checkout</h3>
                  <PaymentSystem />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="services-section">
            <div className="section-header">
              <h2>🚖 Local Services</h2>
              <p>Transport alternatives and local services</p>
            </div>
            
            <div className="services-grid">
              <div className="service-card">
                <h3>🚖 Taxi Services</h3>
                <TaxiButton userLocation={userLocation} />
              </div>
              
              <div className="service-card">
                <h3>🔍 Lost & Found</h3>
                <LostFound />
              </div>
              
              <div className="service-card">
                <h3>📢 Local Ads</h3>
                <AdsPanel />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="community-section">
            <div className="section-header">
              <h2>📋 Community Board</h2>
              <p>Local notices, events and community updates</p>
            </div>
            
            <div className="community-grid">
              <div className="notice-board">
                <h3>📝 Local Notices</h3>
                <div className="notices-list">
                  <div className="notice-item">
                    <span className="notice-type">🏛️ Council</span>
                    <p>Road works on Castle Street - delays expected</p>
                    <small>Posted 2 hours ago</small>
                  </div>
                  <div className="notice-item">
                    <span className="notice-type">🚌 Transport</span>
                    <p>Bus route 1A schedule change from Monday</p>
                    <small>Posted 5 hours ago</small>
                  </div>
                  <div className="notice-item">
                    <span className="notice-type">🎉 Event</span>
                    <p>Kilkenny Arts Festival tickets on sale</p>
                    <small>Posted 1 day ago</small>
                  </div>
                </div>
              </div>
              
              <div className="feedback-corner">
                <h3>☕ Feedback Corner</h3>
                <p>Get free coffee/tea for your valuable feedback!</p>
                <button className="feedback-btn">Share Feedback</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'live-stream' && (
          <div className="stream-section">
            <div className="section-header">
              <h2>📺 Live Stream from Shop</h2>
              <p>See what's happening at our local hub</p>
            </div>
            <LiveStream />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>🚌 Bus Tracker</h4>
            <p>Real-time bus tracking for Kilkenny</p>
          </div>
          <div className="footer-section">
            <h4>📞 Contact</h4>
            <p>Email: info@kilkennybus.ie</p>
            <p>Phone: +353 56 123 4567</p>
          </div>
          <div className="footer-section">
            <h4>🔒 Privacy</h4>
            <p>GDPR Compliant | EU Regulations</p>
            <button className="gdpr-btn">Manage Data</button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 SAI Ltd. - Kilkenny Bus Tracker Portal</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
