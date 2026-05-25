import { NextResponse } from "next/server";
import { appendOrderToSheet } from "@/lib/google-sheets";
import { createOrderRecord, validateOrderPayload } from "@/lib/orders";
import { sendOrderEmails } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validation = validateOrderPayload(payload);

    if (validation.errors || !validation.data) {
      return NextResponse.json(
        { success: false, message: "Please fix the highlighted fields.", errors: validation.errors },
        { status: 400 }
      );
    }

    const order = createOrderRecord(validation.data);

    await appendOrderToSheet(order);
    await sendOrderEmails(order);

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order submission failed", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? `Order submission failed: ${error.message}`
            : "Order submission failed. Please try again."
      },
      { status: 500 }
    );
  }
}
