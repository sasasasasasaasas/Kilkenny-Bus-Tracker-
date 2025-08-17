
import React, { useState } from 'react';
import axios from 'axios';

export default function PaymentSystem({ amount, description, onSuccess, onError }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.post('/api/payments/create-intent', {
                amount: amount * 100, // Convert to cents
                currency: 'eur',
                description,
                paymentMethod
            });

            // In a real implementation, you'd integrate with Stripe Elements
            // For now, we'll simulate a successful payment
            setTimeout(() => {
                setIsProcessing(false);
                if (onSuccess) onSuccess(response.data);
            }, 2000);

        } catch (error) {
            setIsProcessing(false);
            if (onError) onError(error);
        }
    };

    return (
        <div className="payment-system">
            <div className="payment-summary">
                <h4>Payment Summary</h4>
                <div className="amount">€{amount.toFixed(2)}</div>
                <div className="description">{description}</div>
            </div>

            <div className="payment-methods">
                <h5>Payment Method</h5>
                <div className="method-options">
                    <label className={paymentMethod === 'card' ? 'active' : ''}>
                        <input
                            type="radio"
                            name="payment"
                            value="card"
                            checked={paymentMethod === 'card'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        💳 Card Payment
                    </label>
                    <label className={paymentMethod === 'revolut' ? 'active' : ''}>
                        <input
                            type="radio"
                            name="payment"
                            value="revolut"
                            checked={paymentMethod === 'revolut'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        🔄 Revolut Pay
                    </label>
                    <label className={paymentMethod === 'crypto' ? 'active' : ''}>
                        <input
                            type="radio"
                            name="payment"
                            value="crypto"
                            checked={paymentMethod === 'crypto'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        ₿ Cryptocurrency
                    </label>
                </div>
            </div>

            <div className="compliance-notice">
                <p>
                    <small>
                        🔒 Your payment is processed securely through our PCI-compliant payment processor. 
                        By proceeding, you agree to our <a href="/terms">Terms of Service</a> and 
                        <a href="/privacy">Privacy Policy</a>.
                    </small>
                </p>
            </div>

            <button 
                className="pay-button"
                onClick={handlePayment}
                disabled={isProcessing}
            >
                {isProcessing ? 'Processing...' : `Pay €${amount.toFixed(2)}`}
            </button>
        </div>
    );
}
