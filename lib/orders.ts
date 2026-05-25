import { product, calculateTotal } from "@/lib/product";

export type OrderPayload = {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  productName: string;
  quantity: number;
  pricePerPiece: number;
  totalPrice: number;
};

export type OrderRecord = OrderPayload & {
  orderId: string;
  dateTime: string;
  paymentMethod: "Cash On Delivery";
  orderStatus: "New Order";
  notes: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function generateOrderId() {
  const date = new Date();
  const stamp = date
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PG-${stamp}-${random}`;
}

export function validateOrderPayload(input: unknown): { data?: OrderPayload; errors?: Record<string, string> } {
  const body = input as Partial<Record<keyof OrderPayload, unknown>>;
  const errors: Record<string, string> = {};

  const fullName = String(body.fullName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const location = String(body.location ?? "").trim();
  const productName = String(body.productName ?? "").trim();
  const quantity = Number(body.quantity);
  const pricePerPiece = Number(body.pricePerPiece);
  const totalPrice = Number(body.totalPrice);

  if (!fullName) errors.fullName = "Full name is required.";
  if (!phone) errors.phone = "Phone number is required.";
  if (!emailPattern.test(email)) errors.email = "Please enter a valid email address.";
  if (!location) errors.location = "Exact location is required.";
  if (!productName) errors.productName = "Product name is required.";
  if (!Number.isInteger(quantity) || quantity < 1) errors.quantity = "Quantity must be at least 1.";
  if (!Number.isFinite(pricePerPiece) || pricePerPiece <= 0) {
    errors.pricePerPiece = "Price per piece must be valid.";
  }
  if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
    errors.totalPrice = "Total price must be valid.";
  }
  if (productName && productName !== product.name) {
    errors.productName = "Invalid product selected.";
  }
  if (Number.isFinite(pricePerPiece) && pricePerPiece !== product.offerPrice) {
    errors.pricePerPiece = "Invalid product price.";
  }
  if (Number.isInteger(quantity) && quantity >= 1 && totalPrice !== calculateTotal(quantity)) {
    errors.totalPrice = "Invalid total price.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    data: {
      fullName,
      phone,
      email,
      location,
      productName,
      quantity,
      pricePerPiece,
      totalPrice
    }
  };
}

export function createOrderRecord(payload: OrderPayload): OrderRecord {
  return {
    ...payload,
    orderId: generateOrderId(),
    dateTime: new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "medium",
      timeZone: "Asia/Kathmandu"
    }).format(new Date()),
    paymentMethod: "Cash On Delivery",
    orderStatus: "New Order",
    notes: ""
  };
}
