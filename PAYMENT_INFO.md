# Payment Information for IVY

## Current Payment Methods

### 1. Cash on Delivery (COD) ✅
- Customer pays when they receive the order
- Default payment method

### 2. Telda ✅
- **Username:** `ivyeg`
- Customers send the exact order total to this username
- Displayed on checkout page

### 3. InstaPay ⚠️ **NEEDS UPDATE**
- **Current placeholder:** `1234 5678 9012 3456`
- **Status:** You need to replace this with your actual InstaPay card number

## How to Update InstaPay Card Number

Open `/src/pages/Checkout.jsx` and find these two locations:

### Location 1: Checkout Form (around line 406)
```jsx
<p>Send <strong>${getCartTotal().toFixed(2)}</strong> to card: <strong className="payment-card">1234 5678 9012 3456</strong></p>
```

Replace `1234 5678 9012 3456` with your actual InstaPay card number.

### Location 2: Success Page (around line 214)
```jsx
<p className="payment-info-highlight">Card: <strong>1234 5678 9012 3456</strong></p>
```

Replace `1234 5678 9012 3456` with your actual InstaPay card number.

## Payment Flow

1. Customer selects a payment method during checkout
2. Order is placed
3. If Telda or InstaPay is selected:
   - Success page shows payment instructions
   - Displays the exact amount to send
   - Shows the username (Telda) or card number (InstaPay)
4. If COD is selected:
   - Standard delivery confirmation
   - Customer pays upon delivery

## Email Confirmation

Order confirmation emails include:
- Payment method selected
- If online payment: includes payment details
- Order total
- Delivery address
- Contact information

---

**Important:** Remember to update the InstaPay card number before going live!

