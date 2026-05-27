import Link from "next/link";
import { formatPrice, product } from "@/lib/product";

export default function ThankYouPage({
  searchParams
}: {
  searchParams: Promise<{ product?: string; quantity?: string; totalPrice?: string; orderId?: string }>;
}) {
  return <ThankYouContent searchParams={searchParams} />;
}

async function ThankYouContent({
  searchParams
}: {
  searchParams: Promise<{ product?: string; quantity?: string; totalPrice?: string; orderId?: string }>;
}) {
  const params = await searchParams;
  const orderedProduct = params.product || product.name;
  const quantity = Number(params.quantity || product.comboQuantity);
  const totalPrice = Number(params.totalPrice || product.comboPrice);

  return (
    <main className="natural-grid grid min-h-screen place-items-center px-5 py-10">
      <section className="leaf-card mx-auto max-w-2xl rounded-[2.5rem] p-8 text-center shadow-glow sm:p-12">
        <p className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-leaf-700 text-3xl font-black text-white">✓</p>
        <h1 className="mt-6 font-display text-5xl font-black text-leaf-950">Thank you for your order!</h1>
        <p className="mt-4 text-lg leading-8 text-leaf-800">
          Our sales representative will call you soon to confirm your order.
        </p>

        <div className="mt-8 rounded-3xl bg-white p-6 text-left shadow-sm">
          {params.orderId ? <Detail label="Order ID" value={params.orderId} /> : null}
          <Detail label="Product ordered" value={orderedProduct} />
          <Detail label="Quantity" value={quantity} />
          <Detail label="Total price" value={formatPrice(totalPrice)} />
          <Detail label="Payment method" value="Cash On Delivery" />
        </div>

        <Link href="/" className="cta-button mt-8">
          Back to Home
        </Link>
      </section>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-leaf-100 py-4 last:border-b-0">
      <span className="font-semibold text-leaf-700">{label}</span>
      <span className="text-right font-black text-leaf-950">{value}</span>
    </div>
  );
}
