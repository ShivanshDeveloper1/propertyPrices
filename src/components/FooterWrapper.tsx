"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  const hideFooter =
     pathname.startsWith('/oldbooks')

  if (hideFooter) return null;

  return <Footer />;
}