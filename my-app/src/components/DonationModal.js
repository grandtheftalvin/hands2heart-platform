import React, { useState } from 'react';
import './PaymentModal.css';

function DonationModal({ onClose }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: input, 2: processing, 3: success

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (!cleanedPhone || cleanedPhone.length !== 12 || !cleanedPhone.startsWith('254')) {
      setError('Please enter a valid Kenyan phone number (e.g., 254712345678)');
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Please enter a valid donation amount');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/payments/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanedPhone, amount }),
      });
      const data = await response.json();
      if (response.ok) {
        setStep(2);
        // Don't automatically show success - wait for user to complete M-Pesa transaction
        // The success will be determined by the callback or user action
      } else {
        setError(data.message || 'Donation failed');
        setLoading(false);
      }
    } catch (error) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  const handleCompleteTransaction = () => {
    setStep(3);
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={e => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h2>Make a Donation</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="payment-modal-body">
          {step === 1 && (
            <form onSubmit={handleSubmit} className="payment-form">
              <div className="form-group">
                <label htmlFor="phone">M-Pesa Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value.replace(/[^\d\s]/g, ''))}
                  placeholder="254 700 000 000"
                  maxLength="15"
                  disabled={loading}
                  className={error ? 'error' : ''}
                />
              </div>
              <div className="form-group">
                <label htmlFor="amount">Amount (Kshs)</label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  disabled={loading}
                  className={error ? 'error' : ''}
                />
              </div>
              {error && <span className="error-message">{error}</span>}
              <div className="payment-actions">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Donate Now'}
                </button>
              </div>
            </form>
          )}
          {step === 2 && (
            <div className="processing-step">
              <div className="processing-animation">
                <div className="spinner"></div>
              </div>
              <h3>STK Push Sent!</h3>
              <p>Please check your phone for the M-Pesa prompt and enter your PIN to complete the donation.</p>
              <div className="processing-tips">
                <p>💡 Make sure your phone has network coverage</p>
                <p>💡 Enter your M-Pesa PIN when prompted</p>
                <p>💡 You'll receive a confirmation SMS once payment is complete</p>
              </div>
              <div className="payment-actions" style={{ marginTop: '20px' }}>
                <button
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteTransaction}
                  className="btn btn-success"
                >
                  I've Completed the Payment
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="success-step">
              <div className="success-icon">✓</div>
              <h3>Donation Successful!</h3>
              <p>Thank you for your support!</p>
              <p>You will receive a confirmation SMS shortly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DonationModal; 