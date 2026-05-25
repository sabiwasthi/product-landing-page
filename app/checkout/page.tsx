import { Suspense } from "react";
import { CheckoutClient } from "@/components/CheckoutClient";

export default function CheckoutPage() {
  return (
    <main className="natural-grid min-h-screen px-5 py-8">
      <Suspense fallback={<div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 text-leaf-900">Loading checkout...</div>}>
        <CheckoutClient />
      </Suspense>
    </main>
  );
}
