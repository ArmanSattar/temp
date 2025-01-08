"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const WalletMultiButtonNoSSR = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

export function SiteHeader() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full translate-y-[-1rem] animate-fade-in border-b opacity-0 backdrop-blur-[12px] [--animation-delay:600ms]">
      <div className="container flex h-[3.5rem] items-center justify-between">
        <Link 
          className="text-md flex items-center gap-1.5" 
          href="/"
        >
          <div className="flex items-center justify-center">
            <img 
              src="/logos2.png" 
              alt="Solvaults" 
              className="h-12 w-12 object-contain mt-0.5"
            />
          </div>
          <span className="font-medium text-lg">
            Solvaults
          </span>
        </Link>

        <div className="ml-auto flex h-full items-center">
          <WalletMultiButtonNoSSR />
        </div>
      </div>
    </header>
  );
}
