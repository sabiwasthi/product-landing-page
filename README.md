# PureGlow Cash On Delivery Funnel

Complete Next.js + Tailwind CSS sales funnel for a Cash On Delivery handmade soap product.

## Recommended Tech Stack

- Next.js App Router for landing pages, checkout pages, thank-you page, and API routes.
- Tailwind CSS for responsive, premium UI styling.
- Google Sheets API with a Google service account for order storage.
- Nodemailer with SMTP/Gmail for business and customer email notifications.
- Environment variables for all private keys and credentials.

## Order Flow

1. Customer clicks a `Purchase Now`, `Order Now`, or `Buy Now` button.
2. Product name, quantity, price per piece, and total price are passed to `/checkout`.
3. Customer enters name, phone, email, and exact location.
4. Checkout submits the order to `POST /api/order`.
5. The API validates the order, generates an Order ID, adds date/time, sets `Cash On Delivery`, and sets status to `New Order`.
6. The API saves the order to Google Spreadsheet.
7. The API sends an order notification email to your Gmail.
8. The API sends an order received email to the customer.
9. The customer is redirected to `/thank-you`.

The success response is returned only after the spreadsheet submission and both emails complete successfully.

## Environment Variables

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BUSINESS_EMAIL=sabiwasthi@gmail.com
EMAIL_FROM=sabiwasthi@gmail.com
BRAND_NAME=PureGlow

GOOGLE_SHEET_ID=
GOOGLE_SHEET_TAB_NAME=Soap order
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=

EMAIL_SERVICE_API_KEY=

FRONTEND_URL=http://localhost:3000
```

For Gmail SMTP, use a Gmail App Password for `SMTP_PASS`. Do not use your normal Gmail password.

If your Google private key includes newline characters, paste it like this:

```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_LINES\n-----END PRIVATE KEY-----\n"
```

## Google Spreadsheet Setup

1. Create a Google Spreadsheet.
2. Rename the sheet/tab to `Soap order` or set your own tab name in `GOOGLE_SHEET_TAB_NAME`.
3. Add these column names in row 1:

```text
Order ID
Date & Time
Customer Name
Phone Number
Email Address
Exact Location
Product Name
Quantity
Price Per Piece
Total Price
Payment Method
Order Status
Notes
```

4. Select row 1 and make it bold with a green background for easier reading.
5. Select the header row and click `Data > Create a filter`.
6. Add a dropdown to the `Order Status` column with:

```text
New Order
Order Confirmed
Order Ongoing
Delivered
Cancelled
```

7. Copy the Google Sheet ID from the URL:

```text
https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
```

8. Create a Google Cloud service account and enable the Google Sheets API.
9. Add the service account email to `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
10. Add the private key to `GOOGLE_PRIVATE_KEY`.
11. Share the spreadsheet with the service account email as an editor.

## Gmail / Email Setup

The app sends two HTML emails after a successful sheet submission:

- Business email: `New Product Order Received - [Order ID]`
- Customer email: `Your Order Has Been Received - PureGlow`

Use these SMTP values for Gmail:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-gmail-app-password
```

Set `BUSINESS_EMAIL` to the Gmail address that should receive order notifications.
Set `EMAIL_FROM` to the email customers should see as the sender and reply-to address.

## How To Test Order Submission

1. Install dependencies:

```bash
npm install
```

2. Add real values to `.env.local`.
3. Start the app:

```bash
npm run dev
```

4. Open `http://localhost:3000`.
5. Click an order button and submit a checkout order.
6. Confirm:

- The order appears in your Google Sheet.
- You receive the business order email.
- The customer email receives the order confirmation.
- The browser redirects to the thank-you page.

If submission fails, the checkout page shows the error and does not redirect.

## Deploy On Vercel

1. Push this project to GitHub.
2. Import the repo in Vercel.
3. Add all environment variables in `Project Settings > Environment Variables`.
4. Make sure `NEXT_PUBLIC_SITE_URL` and `FRONTEND_URL` use your deployed domain.
5. Deploy the project.
6. Submit a real test order on the production URL.

## Editing Product Details

Product copy, price, combo offer, testimonials, FAQs, and benefits live in:

```text
lib/product.ts
```

The product image is served from:

```text
public/images/pureglow-soap.png
```
