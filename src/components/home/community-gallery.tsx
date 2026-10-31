import Image from "next/image";
import { Camera, Sparkles } from "lucide-react";

const galleryImages = [
  {
    title: "Tree Plantation in Uttara",
    category: "Plantation",
    src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=700&q=80",
    cols: "md:col-span-2",
  },
  {
    title: "Winter Shawl & Blanket Distribution",
    category: "Donation",
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=700&q=80",
    cols: "md:col-span-1",
  },
  {
    title: "Lake Cleaning & Waste Collection",
    category: "Cleanup",
    src: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=700&q=80",
    cols: "md:col-span-1",
  },
  {
    title: "Nutritious Food Packets for Children",
    category: "Food Distribution",
    src: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=700&q=80",
    cols: "md:col-span-2",
  },
  {
    title: "Free Healthcare & Eye Testing Camp",
    category: "Health Camp",
    src: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80",
    cols: "md:col-span-2",
  },
  {
    title: "Primary Education & Book Giveaway",
    category: "Education",
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=700&q=80",
    cols: "md:col-span-1",
  },
];

export function CommunityGallery() {
  return (
    <section className="page-shell py-16 sm:py-20 border-t border-base-200">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="section-kicker justify-center">
          <Camera className="size-4" aria-hidden />
          Moments of Impact
        </span>
        <h2 className="section-title mt-2">
          Community Service in <span className="text-primary">Action</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-base-content/70">
          Photographs captured during recent social development drives organized by passionate citizens and local volunteer teams across Dhaka.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {galleryImages.map((img, i) => (
          <div
            key={i}
            className={`group relative h-64 overflow-hidden rounded-3xl border border-base-300/80 bg-base-200 shadow-sm ${img.cols}`}
          >
            <Image
              src={img.src}
              alt={img.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/80 backdrop-blur-md px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                <Sparkles className="size-3" />
                {img.category}
              </span>
              <h3 className="mt-1.5 text-base font-bold leading-snug drop-shadow-sm">
                {img.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
