# Setup Midtrans Payment Gateway

## 1. Daftar Akun Midtrans

1. Kunjungi [https://midtrans.com](https://midtrans.com)
2. Daftar akun baru atau login
3. Verifikasi email dan lengkapi profil bisnis

## 2. Dapatkan API Keys

### Sandbox (Development)
1. Login ke [Midtrans Dashboard](https://dashboard.midtrans.com)
2. Pilih environment "Sandbox"
3. Pergi ke Settings → Access Keys
4. Copy **Client Key** dan **Server Key**

### Production
1. Setelah bisnis diverifikasi
2. Switch ke environment "Production"
3. Copy **Client Key** dan **Server Key** production

## 3. Konfigurasi Environment

Update file `.env` dengan keys yang didapat:

```env
# Midtrans Configuration
REACT_APP_MIDTRANS_CLIENT_KEY=SB-Mid-client-YOUR_SANDBOX_CLIENT_KEY
REACT_APP_MIDTRANS_SERVER_KEY=SB-Mid-server-YOUR_SANDBOX_SERVER_KEY
REACT_APP_MIDTRANS_IS_PRODUCTION=false

# Untuk Production
# REACT_APP_MIDTRANS_CLIENT_KEY=Mid-client-YOUR_PRODUCTION_CLIENT_KEY
# REACT_APP_MIDTRANS_SERVER_KEY=Mid-server-YOUR_PRODUCTION_SERVER_KEY
# REACT_APP_MIDTRANS_IS_PRODUCTION=true
```

## 4. Backend Integration (Recommended)

Untuk keamanan yang lebih baik, buat backend API untuk handle:

### Express.js Example

```javascript
const express = require('express');
const midtransClient = require('midtrans-client');

const app = express();
app.use(express.json());

// Initialize Midtrans
const snap = new midtransClient.Snap({
  isProduction: false, // Set to true for production
  serverKey: process.env.MIDTRANS_SERVER_KEY
});

// Create transaction
app.post('/api/payment/create-transaction', async (req, res) => {
  try {
    const { transactionData } = req.body;
    
    const transaction = await snap.createTransaction(transactionData);
    
    res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle notification
app.post('/api/payment/notification', (req, res) => {
  const notification = req.body;
  
  // Verify notification
  // Update subscription status in database
  // Send confirmation email
  
  res.status(200).send('OK');
});

app.listen(3001);
```

## 5. Metode Pembayaran yang Tersedia

### Kartu Kredit/Debit
- Visa, Mastercard, JCB
- 3D Secure authentication
- Installment options

### Bank Transfer
- BCA, Mandiri, BNI, BRI, Permata
- Virtual Account
- Real-time notification

### E-Wallet
- GoPay, OVO, DANA, ShopeePay
- LinkAja, Jenius Pay
- QR Code payment

### Retail Outlets
- Alfamart, Indomaret
- Pos Indonesia
- Kioson

## 6. Testing

### Test Cards (Sandbox)
```
Success: 4811 1111 1111 1114
Failure: 4911 1111 1111 1113
Challenge: 4411 1111 1111 1118
```

### Test Bank Transfer
- Use any amount ending with 1 for success
- Use any amount ending with 2 for pending
- Use any amount ending with 3 for failure

## 7. Webhook Configuration

1. Di Midtrans Dashboard, pergi ke Settings → Configuration
2. Set Payment Notification URL: `https://yourdomain.com/api/payment/notification`
3. Enable notification untuk status: pending, settlement, cancel, expire, failure

## 8. Security Best Practices

1. **Never expose Server Key** di frontend
2. **Validate notifications** menggunakan signature
3. **Use HTTPS** untuk production
4. **Implement rate limiting** pada API endpoints
5. **Log all transactions** untuk audit trail

## 9. Error Handling

```javascript
// Handle common errors
const handlePaymentError = (error) => {
  switch (error.status_code) {
    case '400':
      return 'Invalid request parameters';
    case '401':
      return 'Authentication failed';
    case '402':
      return 'Merchant account not activated';
    case '403':
      return 'Access denied';
    case '404':
      return 'Transaction not found';
    case '409':
      return 'Duplicate order ID';
    default:
      return 'Payment processing error';
  }
};
```

## 10. Production Checklist

- [ ] Business verification completed
- [ ] Production API keys configured
- [ ] Webhook URL set and tested
- [ ] SSL certificate installed
- [ ] Error handling implemented
- [ ] Transaction logging setup
- [ ] Customer notification system ready
- [ ] Refund process documented

## Support

- [Midtrans Documentation](https://docs.midtrans.com)
- [API Reference](https://api-docs.midtrans.com)
- [Support Center](https://support.midtrans.com)
- Email: support@midtrans.com