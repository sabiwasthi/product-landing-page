"use client";

import Link from "next/link";
import { useState } from "react";
import { calculateTotal, formatPrice, product } from "@/lib/product";

export function QuantityOrder({ compact = false }: { compact?: boolean }) {
  const [quantity, setQuantity] = useState(product.comboQuantity);
  const total = calculateTotal(quantity);
  const checkoutHref = `/checkout?product=${encodeURIComponent(product.name)}&quantity=${quantity}&pricePerPiece=${product.offerPrice}&totalPrice=${total}`;

  return (
    <div className={compact ? "" : "leaf-card rounded-[2rem] p-6 shadow-glow"}>
      <div className="flex items-end gap-3">
        <span className="text-4xl font-black text-leaf-900">{formatPrice(product.offerPrice)}</span>
        <span className="mb-1 text-lg text-leaf-500 line-through">{formatPrice(product.actualPrice)}</span>
      </div>
      <p className="mt-2 rounded-full bg-leaf-100 px-4 py-2 text-sm font-bold text-leaf-800">
        Combo offer: {formatPrice(product.comboPrice)} for {product.comboQuantity} pieces
      </p>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-leaf-100 bg-white p-3">
        <span className="font-bold text-leaf-900">Quantity</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="grid h-10 w-10 place-items-center rounded-full bg-leaf-100 text-xl font-bold text-leaf-900"
          >
            -
          </button>
          <span className="w-8 text-center text-xl font-black">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((value) => value + 1)}
            className="grid h-10 w-10 place-items-center rounded-full bg-leaf-700 text-xl font-bold text-white"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-leaf-900 p-5 text-white">
        <div className="flex items-center justify-between text-sm text-leaf-100">
          <span>Delivery fee</span>
          <span>Free</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold">Live total</span>
          <span className="text-3xl font-black">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href={checkoutHref} className="cta-button flex-1">
          Purchase Now
        </Link>
        <Link href={checkoutHref} className="secondary-button flex-1">
          Order Now
        </Link>
      </div>
    </div>
  );
}
