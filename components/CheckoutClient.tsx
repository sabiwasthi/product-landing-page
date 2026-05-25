"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { Logo } from "@/components/Logo";
import { calculateTotal, formatPrice, product } from "@/lib/product";

type FieldErrors = Record<string, string>;

export function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quantity = Math.max(1, Number(searchParams.get("quantity") || product.comboQuantity));
  const totalPrice = Number(searchParams.get("totalPrice") || calculateTotal(quantity));
  const pricePerPiece = Number(searchParams.get("pricePerPiece") || product.offerPrice);
  const productName = searchParams.get("product") || product.name;

  const orderSummary = useMemo(
    () => ({
      productName,
      quantity,
      pricePerPiece,
      totalPrice
    }),
    [pricePerPiece, productName, quantity, totalPrice]
  );

  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const form = new FormData(event.currentTarget);
    const payload = {
      fullName: String(form.get("fullName") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      location: String(form.get("location") || ""),
      ...orderSummary
    };

    setIsSubmitting(true);
    setErrors({});
    setMessage("");

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setErrors(result.errors || {});
        setMessage(result.message || "Order submission failed. Please try again.");
        return;
      }

      const params = new URLSearchParams({
        orderId: result.order.orderId,
        product: result.order.productName,
        quantity: String(result.order.quantity),
        totalPrice: String(result.order.totalPrice)
      });
      router.push(`/thank-you?${params.toString()}`);
    } catch {
      setMessage("We could not submit your order right now. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <Logo />
        <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-leaf-800">Cash On Delivery</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="leaf-card rounded-[2rem] p-6 shadow-glow sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf-600">Secure checkout</p>
          <h1 className="mt-3 font-display text-4xl font-black text-leaf-950">Complete your COD order</h1>
          <p className="mt-3 text-leaf-700">Fill your details below. We will call you soon to confirm the order.</p>

          <form onSubmit={submitOrder} className="mt-8 grid gap-5">
            <Field label="Full Name" name="fullName" error={errors.fullName} placeholder="Enter your full name" />
            <Field label="Phone Number" name="phone" error={errors.phone} placeholder="Enter your phone number" />
            <Field label="Email Address" name="email" type="email" error={errors.email} placeholder="you@example.com" />
            <label className="grid gap-2">
              <span className="font-bold text-leaf-950">Exact Location</span>
              <textarea
                name="location"
                placeholder="Kindly share your exact location"
                className="min-h-28 rounded-2xl border border-leaf-100 bg-white px-4 py-3 outline-none transition focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100"
              />
              {errors.location ? <span className="text-sm font-semibold text-red-600">{errors.location}</span> : null}
            </label>

            <div className="grid gap-4 rounded-3xl bg-leaf-50 p-5 sm:grid-cols-2">
              <ReadOnly label="Product Name" value={orderSummary.productName} />
              <ReadOnly label="Quantity" value={orderSummary.quantity} />
              <ReadOnly label="Price Per Piece" value={formatPrice(orderSummary.pricePerPiece)} />
              <ReadOnly label="Total Price" value={formatPrice(orderSummary.totalPrice)} />
            </div>

            {message ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">{message}</div>
            ) : null}

            <button type="submit" disabled={isSubmitting} className="cta-button w-full">
              {isSubmitting ? "Submitting Order..." : "Order Now"}
            </button>
          </form>
        </section>

        <aside className="h-fit rounded-[2rem] bg-leaf-900 p-6 text-white shadow-glow sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf-200">Order summary</p>
          <h2 className="mt-3 font-display text-3xl font-black">{product.name}</h2>
          <p className="mt-4 text-leaf-100">{product.description}</p>
          <div className="mt-6 space-y-4 rounded-3xl bg-white/10 p-5">
            <SummaryRow label="Quantity" value={quantity} />
            <SummaryRow label="Price per piece" value={formatPrice(pricePerPiece)} />
            <SummaryRow label="Delivery fee" value="Free" />
            <SummaryRow label="Payment method" value="Cash On Delivery" />
            <div className="border-t border-white/10 pt-4">
              <SummaryRow label="Total" value={formatPrice(totalPrice)} strong />
            </div>
          </div>
          <p className="mt-5 rounded-2xl bg-cream p-4 text-sm font-bold text-leaf-900">
            No online payment required. Pay only when your order arrives.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  error
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  error?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-bold text-leaf-950">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="rounded-2xl border border-leaf-100 bg-white px-4 py-3 outline-none transition focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100"
      />
      {error ? <span className="text-sm font-semibold text-red-600">{error}</span> : null}
    </label>
  );
}

function ReadOnly({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-leaf-500">{label}</p>
      <p className="mt-1 font-black text-leaf-950">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string | number; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${strong ? "text-2xl font-black" : "text-sm font-semibold"}`}>
      <span className={strong ? "text-white" : "text-leaf-100"}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
