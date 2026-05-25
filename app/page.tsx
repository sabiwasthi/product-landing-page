import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ProductGallery } from "@/components/ProductGallery";
import { QuantityOrder } from "@/components/QuantityOrder";
import { formatPrice, product } from "@/lib/product";

const trustItems = ["Cash on Delivery", "Fast delivery", "Customer support", "Easy order process"];

export default function HomePage() {
  const defaultCheckout = `/checkout?product=${encodeURIComponent(product.name)}&quantity=${product.comboQuantity}&pricePerPiece=${product.offerPrice}&totalPrice=${product.comboPrice}`;

  return (
    <main className="natural-grid min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Logo />
        <Link href={defaultCheckout} className="hidden rounded-full bg-white/80 px-5 py-3 text-sm font-bold text-leaf-800 shadow-sm sm:inline-flex">
          Order Now
        </Link>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-5 inline-flex rounded-full bg-leaf-100 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-leaf-800">
            Natural handmade care
          </p>
          <h1 className="font-display text-5xl font-black leading-tight text-leaf-950 sm:text-6xl lg:text-7xl">
            Soft, fresh skin starts with one gentle bar.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-leaf-800">{product.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={defaultCheckout} className="cta-button">
              Purchase Now
            </Link>
            <Link href="#showcase" className="secondary-button">
              View Offer
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item} className="rounded-2xl border border-leaf-200 bg-white/70 p-4 text-sm font-bold text-leaf-900">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-8 rounded-full bg-leaf-300/20 blur-3xl" />
          <div className="leaf-card relative rounded-[2.5rem] p-8 shadow-glow">
            <Image
              src={product.image}
              alt={product.name}
              width={760}
              height={520}
              className="mx-auto w-full object-contain drop-shadow-2xl"
              priority
            />
            <div className="rounded-3xl bg-leaf-900 p-5 text-white">
              <p className="text-sm uppercase tracking-[0.18em] text-leaf-100">Today&apos;s offer</p>
              <div className="mt-2 flex items-end gap-3">
                <span className="text-3xl font-black">{formatPrice(product.offerPrice)}</span>
                <span className="text-leaf-200 line-through">{formatPrice(product.actualPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="showcase" className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-2">
        <ProductGallery />
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf-600">Product showcase</p>
          <h2 className="mt-4 font-display text-4xl font-black text-leaf-950 sm:text-5xl">{product.name}</h2>
          <p className="mt-5 text-lg leading-8 text-leaf-800">{product.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {product.benefits.slice(0, 6).map((benefit) => (
              <div key={benefit} className="rounded-2xl bg-white/80 p-4 font-semibold text-leaf-900 shadow-sm">
                {benefit}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <QuantityOrder compact />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="rounded-[2.5rem] bg-leaf-900 p-8 text-white shadow-glow lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf-200">Why buy this soap</p>
              <h2 className="mt-4 font-display text-4xl font-black">Small batch care, everyday glow.</h2>
              <p className="mt-4 text-leaf-100">
                PureGlow is built for customers who want a simple, skin-friendly daily soap without harsh chemical heaviness.
              </p>
              <Link href={defaultCheckout} className="mt-8 inline-flex rounded-full bg-white px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-leaf-900">
                Buy Now
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {product.benefits.map((benefit) => (
                <div key={benefit} className="rounded-3xl border border-white/10 bg-white/10 p-5">
                  <div className="mb-4 h-10 w-10 rounded-full bg-leaf-300/30" />
                  <h3 className="text-lg font-bold">{benefit}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf-600">Customer love</p>
          <h2 className="mt-4 font-display text-4xl font-black text-leaf-950">Real words from happy customers</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {product.testimonials.map((testimonial) => (
            <article key={testimonial.name} className="leaf-card rounded-[2rem] p-7 shadow-sm">
              <p className="text-xl text-amber-500">★★★★★</p>
              <p className="mt-5 text-lg leading-8 text-leaf-800">&ldquo;{testimonial.quote}&rdquo;</p>
              <p className="mt-5 font-bold text-leaf-950">- {testimonial.name}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf-600">FAQ</p>
          <h2 className="mt-4 font-display text-4xl font-black text-leaf-950">Questions before ordering?</h2>
        </div>
        <div className="mt-10 space-y-4">
          {product.faqs.map((faq) => (
            <details key={faq.question} className="group rounded-3xl border border-leaf-100 bg-white/85 p-6 shadow-sm open:border-leaf-300">
              <summary className="cursor-pointer list-none text-lg font-bold text-leaf-950">
                {faq.question}
              </summary>
              <p className="mt-4 leading-7 text-leaf-800">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 pt-10">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-leaf-700 to-leaf-950 p-8 text-center text-white shadow-glow lg:p-14">
          <div className="absolute -left-16 top-0 h-52 w-52 rounded-full bg-leaf-300/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-4xl font-black sm:text-5xl">Ready for naturally softer skin?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-leaf-100">
              Order today with Cash on Delivery. No online payment needed.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href={defaultCheckout} className="inline-flex rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-leaf-900">
                Order Now
              </Link>
              <Link href={defaultCheckout} className="inline-flex rounded-full border border-white/30 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white">
                Purchase Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
