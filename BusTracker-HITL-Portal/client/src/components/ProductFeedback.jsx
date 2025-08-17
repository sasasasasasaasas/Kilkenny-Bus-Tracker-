
import React, { useState } from 'react';
import axios from 'axios';

export default function ProductFeedback() {
    const [formData, setFormData] = useState({
        type: 'suggestion',
        message: '',
        contact: '',
        category: 'general',
        priority: 'low',
        gdprConsent: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.gdprConsent) {
            alert('Please consent to data processing to continue.');
            return;
        }
        
        setIsSubmitting(true);
        try {
            await axios.post('/api/feedback', formData);
            alert('Thank you for your feedback! We\'ll review it within 24 hours.');
            setFormData({
                type: 'suggestion',
                message: '',
                contact: '',
                category: 'general',
                priority: 'low',
                gdprConsent: false
            });
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('There was an error. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="feedback-container">
            <div className="feedback-tabs">
                <button 
                    className={formData.type === 'suggestion' ? 'active' : ''}
                    onClick={() => handleChange('type', 'suggestion')}
                >
                    Product Suggestion
                </button>
                <button 
                    className={formData.type === 'complaint' ? 'active' : ''}
                    onClick={() => handleChange('type', 'complaint')}
                >
                    Report Issue
                </button>
                <button 
                    className={formData.type === 'business' ? 'active' : ''}
                    onClick={() => handleChange('type', 'business')}
                >
                    Business Inquiry
                </button>
            </div>

            <form onSubmit={handleSubmit} className="feedback-form">
                <div className="form-group">
                    <label>Category</label>
                    <select 
                        value={formData.category} 
                        onChange={(e) => handleChange('category', e.target.value)}
                        required
                    >
                        <option value="general">General</option>
                        <option value="food">Food & Beverages</option>
                        <option value="retail">Retail Products</option>
                        <option value="transport">Transport Services</option>
                        <option value="advertising">Advertising</option>
                        <option value="council">Council Services</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Priority</label>
                    <select 
                        value={formData.priority} 
                        onChange={(e) => handleChange('priority', e.target.value)}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Message</label>
                    <textarea
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        placeholder="Describe your suggestion, issue, or inquiry..."
                        required
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label>Contact Email (Optional)</label>
                    <input
                        type="email"
                        value={formData.contact}
                        onChange={(e) => handleChange('contact', e.target.value)}
                        placeholder="your.email@example.com"
                    />
                </div>

                <div className="form-group gdpr-consent">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={formData.gdprConsent}
                            onChange={(e) => handleChange('gdprConsent', e.target.checked)}
                            required
                        />
                        <span className="checkmark"></span>
                        I consent to the processing of my personal data in accordance with the 
                        <a href="/privacy" target="_blank"> Privacy Policy</a> and 
                        <a href="/gdpr" target="_blank"> GDPR guidelines</a>.
                    </label>
                </div>

                <button type="submit" disabled={isSubmitting} className="submit-btn">
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    );
}
