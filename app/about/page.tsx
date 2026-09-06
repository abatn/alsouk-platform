"use client";

import { useLanguage } from "@/components/language-provider";
import { MarketplaceShell, Breadcrumbs } from "@/components/marketplace/shell";
import {
  ArrowRight,
  Users,
  Briefcase,
  Newspaper,
  Handshake,
  Mail,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const { t } = useLanguage();
  const ab = t.about;

  return (
    <MarketplaceShell>
      <Breadcrumbs
        items={[
          { label: t.marketplace.breadcrumbHome, href: "/" },
          { label: ab.title },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-20">
        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {ab.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{ab.subtitle}</p>
        </section>

        {/* Mission */}
        <section
          id="mission"
          className="max-w-3xl mx-auto text-center space-y-4"
        >
          <h2 className="text-2xl font-extrabold text-foreground">
            {ab.mission.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {ab.mission.desc}
          </p>
        </section>

        {/* Stats */}
        <section id="stats" className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {ab.stats.items.map((s, i) => (
            <div
              key={i}
              className="text-center rounded-2xl border border-border bg-card p-6"
            >
              <span className="text-3xl font-extrabold text-primary">
                {s.value}
              </span>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </section>

        {/* Team */}
        <section id="team" className="space-y-8">
          <h2 className="text-2xl font-extrabold text-foreground text-center">
            {ab.team.title}
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {ab.team.members.map((m, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-6 text-center space-y-3"
              >
                <div className="flex size-16 mx-auto items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xl font-bold text-primary-foreground">
                  {m.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </div>
                <h3 className="font-bold text-foreground">{m.name}</h3>
                <p className="text-xs font-semibold text-primary uppercase">
                  {m.role}
                </p>
                <p className="text-sm text-muted-foreground">{m.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Careers */}
        <section id="careers" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Briefcase className="size-8 text-primary mx-auto" />
            <h2 className="text-2xl font-extrabold text-foreground">
              {ab.careers.title}
            </h2>
            <p className="text-muted-foreground">{ab.careers.desc}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {ab.careers.values.map((v, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-5 space-y-2"
              >
                <h3 className="font-bold text-foreground">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {ab.careers.positions.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4"
              >
                <div>
                  <p className="font-semibold text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.department} · {p.location}
                  </p>
                </div>
                <Link
                  href="#"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  {ab.careers.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Press */}
        <section id="press" className="max-w-2xl mx-auto text-center space-y-4">
          <Newspaper className="size-8 text-primary mx-auto" />
          <h2 className="text-2xl font-extrabold text-foreground">
            {ab.press.title}
          </h2>
          <p className="text-muted-foreground">{ab.press.desc}</p>
          <a
            href={`mailto:${ab.press.contact.email}`}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-all"
          >
            <Mail className="size-4" />
            {ab.press.contact.label}: {ab.press.contact.email}
          </a>
        </section>

        {/* Partners */}
        <section id="partners" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Handshake className="size-8 text-primary mx-auto" />
            <h2 className="text-2xl font-extrabold text-foreground">
              {ab.partners.title}
            </h2>
            <p className="text-muted-foreground">{ab.partners.desc}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {ab.partners.categories.map((cat, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-5 space-y-3"
              >
                <h3 className="font-bold text-foreground">{cat.name}</h3>
                <ul className="space-y-1">
                  {cat.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground">
                      · {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl border border-border bg-card p-10 space-y-4">
          <h2 className="text-2xl font-extrabold text-foreground">
            {ab.cta.title}
          </h2>
          <p className="text-muted-foreground">{ab.cta.desc}</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-all"
          >
            {ab.cta.button}
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </div>
    </MarketplaceShell>
  );
}
