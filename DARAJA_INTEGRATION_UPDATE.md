# Daraja Integration Update for Bidding Functionality

## Summary
Updated the bidding payment functionality to use the actual Daraja API instead of simulation, making it consistent with the donation functionality.

## Changes Made

### 1. Backend Changes (`server/routes/paymentRoutes.js`)

#### Updated `/api/payments/initiate` endpoint:
- **Before**: Used simulation with fake transaction IDs
- **After**: Full Daraja API integration with:
  - OAuth token generation
  - STK Push requests to `https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest`
  - Proper error handling for Daraja responses
  - Transaction status tracking via `CheckoutRequestID`

#### Enhanced `/api/payments/callback` endpoint:
- **Before**: Basic callback logging only
- **After**: Complete payment status management:
  - Processes M-Pesa callback responses
  - Updates payment status to 'completed' or 'failed'
  - Stores M-Pesa receipt numbers and transaction dates
  - Handles both successful and failed transactions

### 2. Frontend Changes (`my-app/src/components/PaymentModal.js`)

#### Improved User Experience:
- **Processing Time**: Increased from 3 to 5 seconds to allow more time for M-Pesa transactions
- **Better Error Handling**: Enhanced error messages to show Daraja-specific errors
- **Accurate Messaging**: Updated UI text to reflect actual STK Push process:
  - "STK Push Sent!" instead of "Processing Payment..."
  - "Payment Initiated Successfully!" instead of "Payment Successful!"
  - Added helpful tips about M-Pesa confirmation SMS

## Database Schema Requirements

The following fields are used in the `payments` table:
- `transaction_id` - Stores Daraja's `CheckoutRequestID`
- `status` - Tracks payment status ('pending', 'completed', 'failed')
- `mpesa_receipt_number` - Stores M-Pesa receipt number from callback
- `transaction_date` - Stores M-Pesa transaction date
- `updated_at` - Tracks when payment status was last updated

## Environment Variables Required

Ensure these environment variables are set in your `.env` file:
```
DARAJA_CONSUMER_KEY=your_consumer_key
DARAJA_CONSUMER_SECRET=your_consumer_secret
DARAJA_SHORTCODE=your_shortcode
DARAJA_PASSKEY=your_passkey
DARAJA_CALLBACK_URL=your_callback_url
```

## Testing

### For Bidding Payments:
1. Place a bid on an artefact
2. Wait for bid approval
3. Click "Pay Now" in notifications
4. Enter valid Kenyan phone number (254XXXXXXXXX)
5. Complete M-Pesa transaction on phone
6. Check payment status in database

### For Donations:
1. Use donation modal
2. Enter phone number and amount
3. Complete M-Pesa transaction
4. Verify donation is recorded

## Benefits

1. **Consistent Integration**: Both bidding and donations now use the same Daraja API
2. **Real Transactions**: Actual M-Pesa STK Push instead of simulation
3. **Better Tracking**: Payment status properly tracked via callbacks
4. **Improved UX**: More accurate user feedback and instructions
5. **Error Handling**: Proper error messages for Daraja API issues

## Next Steps

Consider implementing:
1. Payment status polling for real-time updates
2. Payment retry functionality for failed transactions
3. Payment receipt generation
4. Admin dashboard for payment monitoring 