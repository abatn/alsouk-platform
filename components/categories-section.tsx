"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Utensils,
  Shirt,
  Building2,
  Cog,
  FlaskConical,
  Cpu,
  Package,
  Leaf,
  Sofa,
  Grid,
  Layers,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { getCategoryName } from "@/lib/category-i18n"
import { fetchCategories } from "@/lib/services/categories-client"
import type { Category } from "@/lib/domains/category/types"

/**
 * Maps category slugs to icons. Covers the DB categories plus a generic
 * fallback for any slug that doesn't have a dedicated icon.
 */
const ICON_BY_SLUG: Record<string, LucideIcon> = {
  food: Utensils,
  textile: Shirt,
  textiles: Shirt,
  construction: Building2,
  mechanical: Cog,
  machinery: Cog,
  chemical: FlaskConical,
  chemicals: FlaskConical,
  electrical: Cpu,
  packaging: Package,
  agriculture: Leaf,
  furniture: Sofa,
  electronics: Cpu,
  handicrafts: Layers,
  cosmetics: Layers,
  leather: Layers,
}

function iconForSlug(slug: string): LucideIcon {
  return ICON_BY_SLUG[slug] ?? Layers
}

export function CategoriesSection() {
  const { t, lang } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    let active = true
    fetchCategories().then((data) => {
      if (!active) return
      setCategories(data.filter((c) => !c.parentId))
    })
    return () => {
      active = false
    }
  }, [])

  if (categories.length === 0) return null

  return (
    <section id="categories" className="py-6 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-4 border-b border-border/60 pb-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {t.categories.title}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">{t.categories.subtitle}</p>
          </div>
        </div>

        {/* Horizontal scrolling on mobile/tablet viewports */}
        <div className="no-scrollbar -mx-6 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:grid sm:grid-cols-3 md:grid-cols-6 sm:overflow-visible sm:px-0 sm:mx-0">
          {categories.map((cat) => {
            const Icon = iconForSlug(cat.slug)
            const catName = getCategoryName(cat.slug, lang, cat.name)
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group flex w-[100px] shrink-0 snap-start flex-col items-center gap-3 rounded-[20px] border border-border bg-card p-3 text-center transition-all duration-300 hover:border-primary/25 hover:shadow-sm active:scale-[0.98] sm:w-auto"
              >
                <span className="flex size-12 items-center justify-center rounded-[20px] bg-secondary text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5.5" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="line-clamp-2 text-xs font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
                    {catName}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
