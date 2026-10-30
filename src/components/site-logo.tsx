import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label={`${siteConfig.name} home`}
    >
      <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white shadow-sm transition-transform duration-300 group-hover:-rotate-6">
        <Image
          src="/sdep-log.png"
          alt=""
          width={40}
          height={40}
          className="size-full object-contain"
          priority
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-semibold tracking-tight">
          {siteConfig.name}
        </span>
        <span className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-base-content/60">
          Community Service
        </span>
      </span>
    </Link>
  );
}
