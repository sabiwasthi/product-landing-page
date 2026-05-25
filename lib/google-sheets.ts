import { google } from "googleapis";
import type { OrderRecord } from "@/lib/orders";

const sheetHeaders = [
  "Order ID",
  "Date & Time",
  "Customer Name",
  "Phone Number",
  "Email Address",
  "Exact Location",
  "Product Name",
  "Quantity",
  "Price Per Piece",
  "Total Price",
  "Payment Method",
  "Order Status",
  "Notes"
];

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizePrivateKey(key: string) {
  return key.replace(/\\n/g, "\n");
}

export async function appendOrderToSheet(order: OrderRecord) {
  const spreadsheetId = requiredEnv("GOOGLE_SHEET_ID");
  const clientEmail = requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = normalizePrivateKey(requiredEnv("GOOGLE_PRIVATE_KEY"));
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME || "Soap order";

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties.title"
  });
  const availableTabs = spreadsheet.data.sheets?.map((sheet) => sheet.properties?.title).filter(Boolean) || [];
  const resolvedTabName =
    availableTabs.find((title) => title === tabName) ||
    availableTabs.find((title) => title?.trim().toLowerCase() === tabName.trim().toLowerCase()) ||
    availableTabs[0];

  if (!resolvedTabName) {
    throw new Error("No sheet tabs were found in the configured spreadsheet.");
  }

  const range = `'${resolvedTabName}'!A:M`;

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          order.orderId,
          order.dateTime,
          order.fullName,
          order.phone,
          order.email,
          order.location,
          order.productName,
          order.quantity,
          order.pricePerPiece,
          order.totalPrice,
          order.paymentMethod,
          order.orderStatus,
          order.notes
        ]
      ]
    }
  });
}

export { sheetHeaders };
