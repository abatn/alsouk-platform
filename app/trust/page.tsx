"use client";

import { useLanguage } from "@/components/language-provider";
import { MarketplaceShell, Breadcrumbs } from "@/components/marketplace/shell";
import {
  FileText,
  Shield,
  CheckCircle,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ICONS: Record<string, any> = { FileText, Shield, CheckCircle };

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

export default function TrustPage() {
  const { t } = useLanguage();
  const trust = t.trust;

  return (
    <MarketplaceShell>
      <Breadcrumbs
        items={[
          { label: t.marketplace.breadcrumbHome, href: "/" },
          { label: trust.title },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-20">
        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {trust.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{trust.subtitle}</p>
        </section>

        {/* Trade Assurance */}
        <section id="trade-assurance" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-extrabold text-foreground">
              {trust.tradeAssurance.title}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {trust.tradeAssurance.desc}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {trust.tradeAssurance.steps.map((step, i) => {
              const Icon = ICONS[step.icon] || Shield;
              return (
                <div
                  key={i}
                  className="relative rounded-2xl border border-border bg-card p-6 text-center space-y-4"
                >
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div className="flex justify-center pt-2">
                    <Icon className="size-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Buyer Protection */}
        <section id="buyer-protection" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-extrabold text-foreground">
              {trust.buyerProtection.title}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {trust.buyerProtection.desc}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {trust.buyerProtection.features.map((f, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <CheckCircle className="size-5 shrink-0 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-bold text-foreground">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Verification */}
        <section id="verification" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-extrabold text-foreground">
              {trust.verification.title}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {trust.verification.desc}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trust.verification.process.map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border border-border bg-card p-5 space-y-3"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {step.step}
                </span>
                <h3 className="font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {trust.verification.badges.map((b) => (
              <span
                key={b.name}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${b.color}`}
              >
                <Shield className="size-4" />
                {b.name} — {b.desc}
              </span>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold text-foreground text-center">
            FAQ
          </h2>
          <div className="space-y-3">
            {trust.faq.map((item, i) => (
              <FaqItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl border border-border bg-card p-10 space-y-4">
          <h2 className="text-2xl font-extrabold text-foreground">
            {trust.cta.title}
          </h2>
          <p className="text-muted-foreground">{trust.cta.desc}</p>
          <Link
            href="/rfq"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-all"
          >
            {trust.cta.button}
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </div>
    </MarketplaceShell>
  );
}
