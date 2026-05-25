export const product = {
  brandName: "PureGlow",
  name: "Handmade Soap",
  slug: "handmade-soap",
  description:
    "Made with skin-loving natural oils and handcrafted in small batches, this soap gently cleanses while keeping your skin soft, fresh, and hydrated. Perfect for daily use and suitable for all skin types.",
  image: "/images/pureglow-soap.png",
  actualPrice: 299,
  offerPrice: 150,
  comboQuantity: 3,
  comboPrice: 400,
  deliveryFee: 0,
  currency: "Rs",
  benefits: [
    "Gentle cleansing without dryness",
    "Deep hydration from natural oils",
    "Nourishes healthy-looking skin",
    "Suitable for dry, oily, and sensitive skin",
    "Fresh, smooth feeling after every wash",
    "Chemical-free handmade care",
    "Gentle enough for daily use"
  ],
  testimonials: [
    {
      name: "Priya Sharma",
      quote:
        "I have tried many soaps before, but this handmade soap feels completely different. My skin feels soft, fresh, and moisturized after every wash. Highly recommended!"
    },
    {
      name: "Ramesh Thapa",
      quote:
        "This soap helped reduce the dryness on my skin within a few days. I love the natural fragrance and how gentle it feels on sensitive skin."
    }
  ],
  faqs: [
    {
      question: "Is this handmade soap suitable for all skin types?",
      answer:
        "Yes, our handmade soap is made with gentle natural ingredients that are suitable for most skin types, including dry and sensitive skin."
    },
    {
      question: "Can I use this soap on my face and body?",
      answer:
        "Yes, the soap is safe for both face and body use. However, if you have very sensitive skin, we recommend doing a patch test first."
    },
    {
      question: "Does the soap contain harmful chemicals?",
      answer:
        "No, our handmade soap is free from harsh chemicals and is carefully crafted with skin-friendly ingredients."
    },
    {
      question: "How long does one soap bar last?",
      answer:
        "With regular daily use, one soap bar typically lasts around 3-4 weeks depending on usage and storage."
    },
    {
      question: "How should I store the soap after use?",
      answer:
        "Keep the soap in a dry soap dish with proper drainage to help it last longer and maintain its quality."
    },
    {
      question: "Does the soap help with dry skin?",
      answer:
        "Yes, the natural oils used in the soap help moisturize and nourish the skin, making it ideal for dry skin."
    },
    {
      question: "Is the soap handmade in small batches?",
      answer:
        "Yes, each soap bar is handcrafted in small batches to ensure quality, freshness, and care in every product."
    }
  ]
};

export function calculateTotal(quantity: number) {
  const wholeCombos = Math.floor(quantity / product.comboQuantity);
  const remainingItems = quantity % product.comboQuantity;

  return wholeCombos * product.comboPrice + remainingItems * product.offerPrice + product.deliveryFee;
}

export function formatPrice(amount: number) {
  return `${product.currency} ${amount.toLocaleString("en-IN")}`;
}
