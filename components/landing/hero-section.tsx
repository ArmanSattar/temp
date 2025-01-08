"use client";

import TextShimmer from "@/components/magicui/text-shimmer";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useRef } from "react";
import { ContactForm } from "../contact-form/contact-form";

export default function HeroSection() {
  const ref = useRef(null);

  return (
    <section className="relative mx-auto flex min-h-screen flex-col items-center justify-start px-6 md:px-8 pt-32">
      {/* Header Content */}
      <div className="text-center max-w-[80rem] mb-12">
        <div className="backdrop-filter-[12px] inline-flex h-7 items-center justify-between rounded-full border border-white/5 bg-white/10 px-3 text-xs text-white dark:text-black transition-all ease-in hover:cursor-pointer hover:bg-white/20 group gap-1 translate-y-[-1rem] animate-fade-in opacity-0">
          <TextShimmer className="inline-flex items-center justify-center">
            <span>✨ Introducing Snapshot Tool</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </TextShimmer>
        </div>

        <h1 className="bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text py-6 text-4xl font-medium leading-none tracking-tighter text-transparent text-balance sm:text-5xl md:text-6xl lg:text-7xl translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
          Take snapshots of
          <br className="hidden md:block" /> Solana contracts instantly.
        </h1>

        <p className="mb-8 text-base tracking-tight text-gray-400 md:text-lg text-balance translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
          Fast and reliable snapshot tool for Solana smart contracts.
          <br className="hidden md:block" /> Enter your contract address and get started.
        </p>
      </div>

      {/* Contact Form Section */}
      <div
        ref={ref}
        className="w-full max-w-lg mx-auto animate-fade-up opacity-0 [--animation-delay:400ms] relative z-10"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-one)] via-[var(--color-two)] to-[var(--color-three)] blur-2xl opacity-10" />
          <ContactForm className="relative border border-white/10 backdrop-blur-sm rounded-xl overflow-hidden" />
        </div>
      </div>
    </section>
  );
}
