import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-3 ${className}`}
      aria-label={`${siteConfig.name} home`}
    >
      {/* Image Wrapper */}
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-sm transition-transform duration-300 group-hover:-rotate-6">
        <Image
          src="/sdep-log.png"
          alt="SDEP Logo"
          width={44}
          height={44}
          className="size-full object-contain"
          priority
        />
      </div>
      
      {/* Text Wrapper - Tightened to cover the full area */}
      <div className="flex flex-col justify-center">
        <span className="font-sans text-2xl font-bold tracking-tight text-base-content leading-[1.1]">
          {siteConfig.name}
        </span>
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-base-content/70 leading-tight">
          <span className="block">Social Development</span>
          <span className="block">Event Platform</span>
        </span>
      </div>
    </Link>
  );
}