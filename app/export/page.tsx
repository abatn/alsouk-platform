"use client";

import { useLanguage } from "@/components/language-provider";
import { MarketplaceShell, Breadcrumbs } from "@/components/marketplace/shell";
import { ArrowRight, Ship, Plane, Truck, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const SHIPPING_ICONS = [Ship, Plane, Truck];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-sm font-semibold text-foreground hover:bg-secondary/50 transition-colors"
      >
        {question}
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function ExportPage() {
  const { t } = useLanguage();
  const exp = t.export;

  return (
    <MarketplaceShell>
      <Breadcrumbs
        items={[
          { label: t.marketplace.breadcrumbHome, href: "/" },
          { label: exp.title },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-20">
        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {exp.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{exp.subtitle}</p>
        </section>

        {/* Export Advantages */}
        <section className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {exp.items.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-6 space-y-3"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <span className="text-2xl font-extrabold text-primary">
                    {item.stat}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                <span className="text-xs font-semibold text-primary uppercase">
                  {item.statLabel}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Options */}
        <section id="shipping" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-extrabold text-foreground">
              Shipping Options
            </h2>
            <p className="mt-3 text-muted-foreground">
              Multiple shipping methods to reach markets across Europe, Africa,
              and the Middle East.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {["Sea Freight", "Air Freight", "Road Transport"].map((name, i) => {
              const Icon = SHIPPING_ICONS[i] || Ship;
              return (
                <div
                  key={name}
                  className="rounded-2xl border border-border bg-card p-6 text-center space-y-4"
                >
                  <Icon className="size-10 text-primary mx-auto" />
                  <h3 className="font-bold text-foreground">{name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {i === 0 &&
                      "Cost-effective for bulk orders. 5-7 days to EU ports."}
                    {i === 1 &&
                      "Fastest option for urgent shipments. 1-3 days worldwide."}
                    {i === 2 &&
                      "Direct road transport to North African neighbors."}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl border border-border bg-card p-10 space-y-4">
          <h2 className="text-2xl font-extrabold text-foreground">
            Ready to export?
          </h2>
          <p className="text-muted-foreground">
            Connect with verified Tunisian suppliers and source quality products
            for your market.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-all"
          >
            Browse Categories
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </div>
    </MarketplaceShell>
  );
}
