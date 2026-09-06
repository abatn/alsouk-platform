"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  Globe,
  LogOut,
  Mail,
  Menu,
  User,
  X,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/components/auth-provider";
import { LANGS } from "@/lib/i18n";
import { NotificationBell } from "@/components/marketplace/notification-bell";

export function SiteHeader() {
  const { t, lang, setLang } = useLanguage();
  const { user, isLoading, signOut } = useAuth();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  /* Close dropdowns on outside click */
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node))
        setLangOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = LANGS.find((l) => l.code === lang)!;

  /** First letter of email as avatar fallback */
  const avatarLetter = user?.email?.[0]?.toUpperCase() ?? "?";

  /* ── Language Switcher ── */
  const LangSwitcher = (
    <div className="relative" ref={langRef}>
      <button
        type="button"
        onClick={() => setLangOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:border-primary/30 transition-all shadow-sm"
        aria-haspopup="listbox"
        aria-expanded={langOpen}
      >
        <Globe className="size-3.5 text-primary/80" />
        <span>{current.native}</span>
        <ChevronDown
          className={`size-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
        />
      </button>
      {langOpen && (
        <div
          role="listbox"
          className="absolute end-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md p-1 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {LANGS.map((l) => (
            <button
              key={l.code}
              role="option"
              aria-selected={l.code === lang}
              onClick={() => {
                setLang(l.code);
                setLangOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-popover-foreground transition-colors hover:bg-secondary/80"
            >
              <span className="flex flex-col items-start text-start">
                <span className="font-semibold">{l.native}</span>
                <span className="text-[10px] text-muted-foreground">
                  {l.label}
                </span>
              </span>
              {l.code === lang && <Check className="size-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  /* ── Desktop Auth Buttons (logged out) ── */
  const DesktopAuthLoggedOut = (
    <div className="hidden lg:flex items-center gap-2">
      <Link
        href="/login"
        className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        {t.nav.signIn}
      </Link>
      <Link
        href="/register"
        className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all shadow-sm"
      >
        {t.nav.joinFree}
      </Link>
    </div>
  );

  /* ── Desktop User Menu (logged in) ── */
  const DesktopUserMenu = (
    <div className="hidden lg:flex items-center relative" ref={userMenuRef}>
      <button
        type="button"
        onClick={() => setUserMenuOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-2 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:border-primary/30 transition-all shadow-sm"
        aria-haspopup="menu"
        aria-expanded={userMenuOpen}
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-600 text-[10px] font-bold text-primary-foreground">
          {avatarLetter}
        </span>
        <ChevronDown
          className={`size-3 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
        />
      </button>
      {userMenuOpen && (
        <div
          role="menu"
          className="absolute end-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md p-1 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="px-3 py-2 border-b border-border/50 mb-1">
            <p className="text-[10px] text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setUserMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-popover-foreground transition-colors hover:bg-secondary/80"
          >
            <User className="size-3.5" />
            {t.bottomNav.account}
          </Link>
          <Link
            href="/messages"
            role="menuitem"
            onClick={() => setUserMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-popover-foreground transition-colors hover:bg-secondary/80"
          >
            <Mail className="size-3.5" />
            {t.bottomNav.messages}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setUserMenuOpen(false);
              signOut();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-popover-foreground transition-colors hover:bg-secondary/80"
          >
            <LogOut className="size-3.5" />
            {t.auth.logout}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full h-16 border-b border-border/40 bg-background/70 backdrop-blur-lg flex items-center">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 flex items-center justify-between">
        {/* ALSOUK Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-transform duration-200"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-600 font-black text-sm text-primary-foreground shadow-md shadow-primary/20 group-hover:scale-105 transition-all">
            A
          </span>
          <span className="text-lg font-black tracking-tight text-foreground">
            AL
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              SOUK
            </span>
          </span>
        </Link>

        {/* Right Side: Auth, Lang, Notification, Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop auth — only render when not loading to avoid flash */}
          {!isLoading && (user ? DesktopUserMenu : DesktopAuthLoggedOut)}

          {LangSwitcher}

          {/* Notification Dropdown Bell */}
          <NotificationBell />

          {/* Menu Button (mobile) */}
          <button
            className="inline-flex size-9 items-center justify-center rounded-xl border border-border/50 bg-card/50 text-foreground transition-all hover:bg-secondary hover:scale-105 active:scale-95"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation / Menu Overlay */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 border-b border-border/30 bg-background/95 backdrop-blur-lg shadow-lg animate-in slide-in-from-top-2 duration-200 p-4">
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-xs font-bold text-foreground transition-all hover:bg-secondary/60"
            >
              {t.bottomNav.home}
            </Link>
            <Link
              href="/categories"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-xs font-bold text-foreground transition-all hover:bg-secondary/60"
            >
              {t.nav.categories}
            </Link>
            <Link
              href="/rfq"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-xs font-bold text-foreground transition-all hover:bg-secondary/60"
            >
              {t.nav.rfq}
            </Link>
            <Link
              href="/suppliers"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-xs font-bold text-foreground transition-all hover:bg-secondary/60"
            >
              {t.nav.suppliers}
            </Link>
            <Link
              href="/exhibitions"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-xs font-bold text-foreground transition-all hover:bg-secondary/60"
            >
              {t.nav.exhibitions}
            </Link>

            {/* Mobile Auth Section */}
            {!isLoading && (
              <div className="border-t border-border/30 mt-2 pt-2">
                {user ? (
                  <>
                    <div className="px-4 py-2 mb-1">
                      <p className="text-[10px] text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-foreground transition-all hover:bg-secondary/60"
                    >
                      <User className="size-4" />
                      {t.bottomNav.account}
                    </Link>
                    <Link
                      href="/messages"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-foreground transition-all hover:bg-secondary/60"
                    >
                      <Mail className="size-4" />
                      {t.bottomNav.messages}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        signOut();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-foreground transition-all hover:bg-secondary/60"
                    >
                      <LogOut className="size-4" />
                      {t.auth.logout}
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 px-4">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center rounded-full border border-border px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary/60 transition-all"
                    >
                      {t.nav.signIn}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all"
                    >
                      {t.nav.joinFree}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
