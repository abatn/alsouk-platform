"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Breadcrumbs } from "@/components/marketplace/shell";
import {
  Search,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

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

export function HelpContent() {
  const { t } = useLanguage();
  const h = t.help;
  const [activeCategory, setActiveCategory] = useState(0);
  const [formSent, setFormSent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs =
    h.faq.categories[activeCategory]?.items.filter(
      (item) =>
        !searchQuery ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t.marketplace.breadcrumbHome, href: "/" },
          { label: h.title },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-16">
        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {h.title}
          </h1>
          <p className="text-lg text-muted-foreground">{h.subtitle}</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={h.searchPlaceholder}
              className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all"
            />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="space-y-6">
          <h2 className="text-2xl font-extrabold text-foreground text-center">
            {h.faq.title}
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {h.faq.categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(i)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  activeCategory === i
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="space-y-3 max-w-3xl mx-auto">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item, i) => (
                <FaqItem
                  key={i}
                  question={item.question}
                  answer={item.answer}
                />
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground py-8">
                No matching questions found.
              </p>
            )}
          </div>
        </section>

        {/* Report Abuse */}
        <section className="max-w-2xl mx-auto text-center space-y-3 rounded-2xl border border-border bg-card p-8">
          <AlertTriangle className="size-6 text-amber-500 mx-auto" />
          <h3 className="font-bold text-foreground">Report Abuse</h3>
          <p className="text-sm text-muted-foreground">
            Found suspicious activity or a policy violation? Let us know.
          </p>
          <a
            href="mailto:abuse@alsouk.com?subject=Report%20Abuse%20—%20ALSOUK"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-all"
          >
            <Mail className="size-4" />
            Report via Email
          </a>
        </section>

        {/* Contact */}
        <section id="contact" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl font-extrabold text-foreground">
              {h.contact.title}
            </h2>
            <p className="text-muted-foreground">{h.contact.desc}</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Form */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              {formSent ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <CheckCircle className="size-10 text-green-500" />
                  <p className="text-sm font-semibold text-foreground">
                    {h.contact.form.success}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFormSent(true);
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    placeholder={h.contact.form.name}
                    required
                    className="w-full rounded-xl border border-border bg-secondary/15 px-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all"
                  />
                  <input
                    type="email"
                    placeholder={h.contact.form.email}
                    required
                    className="w-full rounded-xl border border-border bg-secondary/15 px-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all"
                  />
                  <input
                    type="text"
                    placeholder={h.contact.form.subject}
                    required
                    className="w-full rounded-xl border border-border bg-secondary/15 px-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all"
                  />
                  <textarea
                    placeholder={h.contact.form.message}
                    required
                    rows={4}
                    className="w-full rounded-xl border border-border bg-secondary/15 px-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-all"
                  >
                    {h.contact.form.submit}
                  </button>
                </form>
              )}
            </div>
            {/* Info */}
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Mail className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {h.contact.info.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {h.contact.info.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Address
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {h.contact.info.address}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Hours</p>
                  <p className="text-sm text-muted-foreground">
                    {h.contact.info.hours}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
