"use client";

import { FaWhatsapp } from "react-icons/fa";

interface WhatsAppButtonProps {
  phoneNumber: string; // Your WhatsApp number in international format, e.g. "917618550475"
  message?: string; // Optional pre-filled message
}

export default function WhatsAppButton({
  phoneNumber,
  message = "Hello, I’d like to know more about Saharanpur property rates!",
}: WhatsAppButtonProps) {
  // Construct WhatsApp URL
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110 z-50"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}
