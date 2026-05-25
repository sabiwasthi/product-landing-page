"use client";

import Image from "next/image";
import { useState } from "react";
import { product } from "@/lib/product";

const galleryStyles = [
  "from-leaf-100 via-white to-cream",
  "from-cream via-white to-leaf-100",
  "from-leaf-50 via-white to-oat/50",
  "from-white via-leaf-50 to-cream"
];

export function ProductGallery() {
  const [active, setActive] = useState(0);

  return (
    <div className="leaf-card rounded-[2rem] p-4 shadow-glow">
      <div className={`relative min-h-[360px] overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${galleryStyles[active]}`}>
        <div className="absolute -left-12 top-10 h-36 w-36 rounded-full bg-leaf-300/30 blur-3xl" />
        <div className="absolute -bottom-16 right-5 h-44 w-44 rounded-full bg-oat/60 blur-3xl" />
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 48vw"
          className="object-contain p-8 drop-shadow-2xl"
          priority
        />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {galleryStyles.map((style, index) => (
          <button
            key={style}
            type="button"
            onClick={() => setActive(index)}
            className={`relative h-24 overflow-hidden rounded-2xl border bg-gradient-to-br ${style} ${
              active === index ? "border-leaf-700 ring-2 ring-leaf-300" : "border-leaf-100"
            }`}
            aria-label={`Show product image ${index + 1}`}
          >
            <Image src={product.image} alt="" fill sizes="120px" className="object-contain p-2" />
          </button>
        ))}
      </div>
    </div>
  );
}
