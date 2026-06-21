"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { Clock, Mail, Phone, Search, Menu, X, ChevronDown, ArrowLeft, Globe } from "lucide-react"
import { type NavItem } from "@/lib/site-data"
import { useNavContent } from "@/lib/nav-content-context"
import { useLanguage } from "@/lib/i18n"
import { useSiteSettings } from "@/lib/site-settings-context"
import { resolveMediaUrl } from "@/lib/media"
import type { TranslationKey } from "@/lib/translations"

type SimpleNav = { key: TranslationKey; href: string }

const leftNav: SimpleNav[] = [
  { key: "nav.home", href: "/" },
  { key: "nav.about", href: "/about-us" },
]
const rightNav: SimpleNav[] = [
  { key: "nav.partner", href: "/become-a-partner" },
  { key: "nav.contact", href: "/contact-us" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [mobileSub, setMobileSub] = useState<string | null>(null)
  const { t, tr, toggleLang } = useLanguage()
  const { solutionsGroups, products, useCases } = useNavContent()
  const { settings } = useSiteSettings()
  const logoSrc = resolveMediaUrl(settings?.images?.logo ?? "/leapai-logo.png")

  return (
    <header className="relative z-50">
      {/* Top utility bar */}
      <div className="hidden bg-navy text-navy-foreground md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-sm">
          <div className="flex items-center gap-2 text-navy-foreground/80">
            <Clock className="size-4 text-amber" />
            <span>{t("header.hours")}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="mailto:info@leapai.ai" className="flex items-center gap-2 transition-colors hover:text-amber">
              <Mail className="size-4 text-amber" />
              <span>info@leapai.ai</span>
            </a>
            <a href="tel:+966535533627" className="flex items-center gap-2 transition-colors hover:text-amber">
              <Phone className="size-4 text-amber" />
              <span dir="ltr">+966 53 553 3627</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="border-b border-white/10 bg-navy text-navy-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="flex items-center shrink-0">
              <Image src={logoSrc} alt="LeapAI" width={150} height={48} priority className="h-10 w-auto" unoptimized />
            </Link>
          </motion.div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex" onMouseLeave={() => setActive(null)}>
            {leftNav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-sm font-semibold text-navy-foreground/85 transition-colors hover:text-amber"
              >
                {t(item.key)}
              </Link>
            ))}

            {/* Solutions - mega menu */}
            <div className="static" onMouseEnter={() => setActive("solutions")}>
              <Link
                href="/solutions"
                className="flex items-center gap-1 text-sm font-semibold text-navy-foreground/85 transition-colors hover:text-amber"
              >
                {t("nav.solutions")}
                <ChevronDown className="size-3.5 opacity-60" />
              </Link>
            </div>

            {/* Products */}
            <div onMouseEnter={() => setActive("products")}>
              <Link
                href="/products"
                className="flex items-center gap-1 text-sm font-semibold text-navy-foreground/85 transition-colors hover:text-amber"
              >
                {t("nav.products")}
                <ChevronDown className="size-3.5 opacity-60" />
              </Link>
            </div>

            {/* Use cases */}
            <div onMouseEnter={() => setActive("use-cases")}>
              <Link
                href="/use-cases"
                className="flex items-center gap-1 text-sm font-semibold text-navy-foreground/85 transition-colors hover:text-amber"
              >
                {t("nav.useCases")}
                <ChevronDown className="size-3.5 opacity-60" />
              </Link>
            </div>

            {rightNav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-sm font-semibold text-navy-foreground/85 transition-colors hover:text-amber"
              >
                {t(item.key)}
              </Link>
            ))}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-sm font-bold text-amber transition-colors hover:text-amber/80"
            >
              <Globe className="size-4" />
              {t("nav.langToggle")}
            </button>

            {/* Dropdown panels */}
            <AnimatePresence>
              {active === "solutions" && (
                <DropdownPanel onMouseEnter={() => setActive("solutions")}>
                  <div className="grid gap-x-8 gap-y-6 md:grid-cols-4">
                    {solutionsGroups.map((group) => (
                      <div key={group.slug}>
                        <Link
                          href={`/solutions#${group.slug}`}
                          className="mb-3 block text-sm font-extrabold text-primary"
                        >
                          {tr(group.title)}
                        </Link>
                        <ul className="flex flex-col gap-2">
                          {group.items.map((it) => (
                            <li key={it.slug}>
                              <Link
                                href={`/solutions/${it.slug}`}
                                className="block text-sm leading-relaxed text-foreground/75 transition-colors hover:text-primary"
                              >
                                {tr(it.title)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </DropdownPanel>
              )}

              {active === "products" && (
                <DropdownPanel onMouseEnter={() => setActive("products")}>
                  <SimpleList items={products} basePath="/products" />
                </DropdownPanel>
              )}

              {active === "use-cases" && (
                <DropdownPanel onMouseEnter={() => setActive("use-cases")}>
                  <SimpleList items={useCases} basePath="/use-cases" />
                </DropdownPanel>
              )}
            </AnimatePresence>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              aria-label={t("nav.langToggle")}
              className="flex items-center gap-1 rounded-full border border-white/25 px-3 py-1.5 text-xs font-bold text-amber transition-colors hover:border-amber lg:hidden"
            >
              <Globe className="size-3.5" />
              {t("nav.langToggle")}
            </button>
            <button
              aria-label={t("header.search")}
              className="hidden size-9 items-center justify-center rounded-full border border-white/25 text-navy-foreground/80 transition-colors hover:border-amber hover:text-amber md:flex"
            >
              <Search className="size-4" />
            </button>
            <Link
              href="/#contact"
              className="hidden rounded-full bg-whatsapp px-5 py-2.5 text-sm font-bold text-whatsapp-foreground shadow-sm transition-colors hover:bg-whatsapp/90 sm:inline-block"
            >
              {t("header.signup")}
            </Link>
            <button
              aria-label={t("header.menu")}
              onClick={() => setOpen((v) => !v)}
              className="flex size-10 items-center justify-center rounded-lg border border-white/25 text-navy-foreground lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.nav
              className="overflow-hidden border-t border-border bg-card px-6 lg:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1, paddingTop: 16, paddingBottom: 16 }}
              exit={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="flex flex-col gap-1">
                {leftNav.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ))}

                <MobileGroup
                  id="solutions"
                  label={t("nav.solutions")}
                  href="/solutions"
                  open={mobileSub === "solutions"}
                  onToggle={() => setMobileSub((v) => (v === "solutions" ? null : "solutions"))}
                  onNavigate={() => setOpen(false)}
                  items={solutionsGroups.flatMap((g) => g.items)}
                  basePath="/solutions"
                />
                <MobileGroup
                  id="products"
                  label={t("nav.products")}
                  href="/products"
                  open={mobileSub === "products"}
                  onToggle={() => setMobileSub((v) => (v === "products" ? null : "products"))}
                  onNavigate={() => setOpen(false)}
                  items={products}
                  basePath="/products"
                />
                <MobileGroup
                  id="use-cases"
                  label={t("nav.useCases")}
                  href="/use-cases"
                  open={mobileSub === "use-cases"}
                  onToggle={() => setMobileSub((v) => (v === "use-cases" ? null : "use-cases"))}
                  onNavigate={() => setOpen(false)}
                  items={useCases}
                  basePath="/use-cases"
                />

                {rightNav.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/#contact"
                    onClick={() => setOpen(false)}
                    className="mt-2 block rounded-full bg-whatsapp px-5 py-2.5 text-center text-sm font-bold text-whatsapp-foreground"
                  >
                    {t("header.signup")}
                  </Link>
                </li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

function DropdownPanel({
  children,
  onMouseEnter,
}: {
  children: React.ReactNode
  onMouseEnter: () => void
}) {
  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-x-0 top-full mt-px"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-b-2xl border-x border-b border-border bg-card p-7 shadow-xl">{children}</div>
      </div>
    </motion.div>
  )
}

function SimpleList({ items, basePath }: { items: NavItem[]; basePath: string }) {
  const { tr } = useLanguage()
  return (
    <ul className="grid gap-x-8 gap-y-2 md:grid-cols-3">
      {items.map((it) => (
        <li key={it.slug}>
          <Link
            href={`${basePath}/${it.slug}`}
            className="group flex items-start gap-2 rounded-lg p-2 transition-colors hover:bg-secondary"
          >
            <span className="text-sm font-semibold leading-relaxed text-foreground/80 transition-colors group-hover:text-primary">
              {tr(it.title)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function MobileGroup({
  id,
  label,
  href,
  open,
  onToggle,
  onNavigate,
  items,
  basePath,
}: {
  id: string
  label: string
  href: string
  open: boolean
  onToggle: () => void
  onNavigate: () => void
  items: NavItem[]
  basePath: string
}) {
  const { tr } = useLanguage()
  return (
    <li>
      <div className="flex items-center justify-between rounded-lg pr-1 hover:bg-secondary">
        <Link
          href={href}
          onClick={onNavigate}
          className="flex-1 px-3 py-2.5 text-sm font-semibold text-foreground/80 hover:text-primary"
        >
          {label}
        </Link>
        <button
          aria-label={label}
          aria-expanded={open}
          onClick={onToggle}
          className="flex size-8 items-center justify-center rounded-md text-foreground/60"
        >
          <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden pr-4"
          >
            {items.map((it) => (
              <li key={it.slug}>
                <Link
                  href={`${basePath}/${it.slug}`}
                  onClick={onNavigate}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/70 transition-colors hover:text-primary"
                >
                  <ArrowLeft className="size-3.5 text-amber rtl:rotate-180" />
                  {tr(it.title)}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  )
}
