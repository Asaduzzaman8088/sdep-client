"use client";

import { useState } from "react";
import { BellRing, CheckCircle, Mail, Send } from "lucide-react";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsSubscribed(true);
    toast.success("Thank you for subscribing!", {
      description: "You will receive updates on upcoming community service days.",
    });
  };

  return (
    <section className="page-shell py-16 sm:py-20 border-t border-base-200">
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-8 sm:p-12 shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-secondary/15 blur-3xl"
        />

        <div className="relative max-w-2xl mx-auto text-center space-y-4">
          <span className="section-kicker justify-center">
            <BellRing className="size-4" aria-hidden />
            Stay Connected
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content">
            Never Miss a <span className="text-primary">Service Day</span> in Your Area
          </h2>
          <p className="text-sm sm:text-base text-base-content/75 leading-relaxed">
            Subscribe to our bi-weekly newsletter to receive alerts for upcoming winter drives, tree plantation events, health camps, and volunteer opportunities.
          </p>

          {isSubscribed ? (
            <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-success/15 border border-success/30 p-4 text-success font-semibold text-sm">
              <CheckCircle className="size-5" />
              <span>You are subscribed to SDEP community alerts!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="input input-bordered w-full pl-10 text-sm focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary rounded-full px-6 gap-2 text-xs font-bold shadow-md"
              >
                Subscribe
                <Send className="size-3.5" />
              </button>
            </form>
          )}

          <p className="text-[0.7rem] text-base-content/50">
            No spam, ever. You can unsubscribe at any time with a single click.
          </p>
        </div>
      </div>
    </section>
  );
}
