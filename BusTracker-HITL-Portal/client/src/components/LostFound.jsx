
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function LostFound() {
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState('browse');
    const [formData, setFormData] = useState({
        type: 'lost',
        title: '',
        description: '',
        category: 'personal',
        location: '',
        date: '',
        contact: '',
        reward: 0,
        verification: '',
        gdprConsent: false
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('/api/lost-found');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.gdprConsent) {
            alert('Please consent to data processing.');
            return;
        }

        try {
            await axios.post('/api/lost-found', formData);
            alert('Item reported successfully! You will be notified of any matches.');
            setFormData({
                type: 'lost',
                title: '',
                description: '',
                category: 'personal',
                location: '',
                date: '',
                contact: '',
                reward: 0,
                verification: '',
                gdprConsent: false
            });
            setShowForm(false);
            fetchItems();
        } catch (error) {
            alert('Error reporting item. Please try again.');
        }
    };

    const handleClaim = async (itemId) => {
        const verification = prompt('Please provide verification details (describe the item, where you lost it, etc.):');
        if (!verification) return;

        try {
            await axios.post(`/api/lost-found/${itemId}/claim`, { verification });
            alert('Claim submitted! The item owner will be notified to verify your claim.');
            fetchItems();
        } catch (error) {
            alert('Error submitting claim. Please try again.');
        }
    };

    return (
        <div className="lost-found-container">
            <div className="lost-found-header">
                <h3>🔍 Lost & Found</h3>
                <div className="tab-buttons">
                    <button 
                        className={activeTab === 'browse' ? 'active' : ''}
                        onClick={() => setActiveTab('browse')}
                    >
                        Browse Items
                    </button>
                    <button 
                        className={activeTab === 'report' ? 'active' : ''}
                        onClick={() => setActiveTab('report')}
                    >
                        Report Item
                    </button>
                </div>
            </div>

            {activeTab === 'browse' && (
                <div className="items-grid">
                    {items.length === 0 ? (
                        <p>No items currently listed.</p>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="item-card">
                                <div className="item-header">
                                    <span className={`status ${item.type}`}>
                                        {item.type === 'lost' ? '🔍 LOST' : '🎯 FOUND'}
                                    </span>
                                    <span className="category">{item.category}</span>
                                </div>
                                <h4>{item.title}</h4>
                                <p>{item.description}</p>
                                <div className="item-details">
                                    <div>📍 {item.location}</div>
                                    <div>📅 {new Date(item.date).toLocaleDateString()}</div>
                                    {item.reward > 0 && (
                                        <div className="reward">💰 Reward: €{item.reward}</div>
                                    )}
                                </div>
                                <div className="item-actions">
                                    {item.type === 'found' ? (
                                        <button 
                                            onClick={() => handleClaim(item.id)}
                                            className="claim-btn"
                                        >
                                            Claim This Item
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => window.open(`mailto:${item.contact}?subject=Lost Item: ${item.title}`)}
                                            className="contact-btn"
                                        >
                                            Contact Owner
                                        </button>
                                    )}
                                </div>
                                <div className="posted-date">
                                    Posted {new Date(item.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'report' && (
                <form onSubmit={handleSubmit} className="report-form">
                    <div className="form-group">
                        <label>Type</label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    value="lost"
                                    checked={formData.type === 'lost'}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                />
                                I lost something
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="found"
                                    checked={formData.type === 'found'}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                />
                                I found something
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select 
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            required
                        >
                            <option value="personal">Personal Items</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing</option>
                            <option value="documents">Documents</option>
                            <option value="jewelry">Jewelry</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="e.g., Black iPhone 13, Blue backpack, etc."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Detailed description to help identify the item..."
                            required
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            placeholder="Where was it lost/found?"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Contact Email</label>
                        <input
                            type="email"
                            value={formData.contact}
                            onChange={(e) => setFormData({...formData, contact: e.target.value})}
                            placeholder="your.email@example.com"
                            required
                        />
                    </div>

                    {formData.type === 'lost' && (
                        <div className="form-group">
                            <label>Reward (Optional)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.reward}
                                onChange={(e) => setFormData({...formData, reward: parseFloat(e.target.value) || 0})}
                                placeholder="0.00"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Verification Details</label>
                        <textarea
                            value={formData.verification}
                            onChange={(e) => setFormData({...formData, verification: e.target.value})}
                            placeholder="Additional details that only the real owner would know..."
                            rows="2"
                        />
                    </div>

                    <div className="form-group gdpr-consent">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.gdprConsent}
                                onChange={(e) => setFormData({...formData, gdprConsent: e.target.checked})}
                                required
                            />
                            I consent to data processing and understand that my contact information will be shared with verified claimants.
                        </label>
                    </div>

                    <button type="submit" className="submit-btn">
                        Report {formData.type === 'lost' ? 'Lost' : 'Found'} Item
                    </button>
                </form>
            )}
        </div>
    );
}
