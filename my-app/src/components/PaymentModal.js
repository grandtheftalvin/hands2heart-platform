import React, { useState } from 'react';
import './PaymentModal.css';

function PaymentModal({ bid, onClose, onSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: phone input, 2: processing, 3: success

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number format
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (!cleanedPhone || cleanedPhone.length !== 12 || !cleanedPhone.startsWith('254')) {
      setError('Please enter a valid Kenyan phone number (e.g., 254712345678)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bid_id: bid.id,
          phone_number: cleanedPhone,
          amount: bid.amount,
          artefact_title: bid.artefact_title
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2);
        // Don't automatically show success - wait for user to complete M-Pesa transaction
        // The success will be determined by the callback or user action
      } else {
        setError(data.message || data.error || 'Payment initiation failed');
        setLoading(false);
      }
    } catch (error) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Only allow digits and spaces
    const cleaned = value.replace(/[^\d\s]/g, '');
    setPhoneNumber(cleaned);
    setError(''); // Clear error when user starts typing
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9, 12)}`;
  };

  const handleCompleteTransaction = () => {
    setStep(3);
    setTimeout(() => {
      onSuccess();
    }, 3000);
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h2>Complete Payment</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="payment-modal-body">
          {step === 1 && (
            <>
              <div className="payment-summary">
                <h3>Payment Summary</h3>
                <div className="summary-item">
                  <span>Artefact:</span>
                  <span>{bid.artefact_title}</span>
                </div>
                <div className="summary-item">
                  <span>Amount:</span>
                  <span className="amount">Kshs {bid.amount?.toLocaleString()}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="payment-form">
                <div className="form-group">
                  <label htmlFor="phone">M-Pesa Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={phoneNumber || ''}
                    onChange={handlePhoneChange}
                    placeholder="254 700 000 000"
                    maxLength="15"
                    disabled={loading}
                    className={error ? 'error' : ''}
                  />
                  {error && <span className="error-message">{error}</span>}
                  <small className="help-text">
                    Enter your M-Pesa registered phone number (12 digits starting with 254)
                  </small>
                </div>

                <div className="payment-instructions">
                  <h4>Instructions:</h4>
                  <ol>
                    <li>Enter your M-Pesa registered phone number</li>
                    <li>Click "Pay Now" to initiate payment</li>
                    <li>You'll receive an M-Pesa prompt on your phone</li>
                    <li>Enter your M-Pesa PIN to complete the transaction</li>
                  </ol>
                </div>

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
                    {loading ? 'Processing...' : 'Pay Now'}
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 2 && (
            <div className="processing-step">
              <div className="processing-animation">
                <div className="spinner"></div>
              </div>
              <h3>STK Push Sent!</h3>
              <p>Please check your phone for the M-Pesa prompt and enter your PIN to complete the payment.</p>
              <div className="processing-tips">
                <p>💡 Make sure your phone has network coverage</p>
                <p>💡 Keep this window open until payment is complete</p>
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
              <h3>Payment Completed!</h3>
              <p>Thank you for completing your payment.</p>
              <p>You will receive a confirmation SMS shortly.</p>
              <button
                onClick={handleCompleteTransaction}
                className="btn btn-primary"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentModal; 