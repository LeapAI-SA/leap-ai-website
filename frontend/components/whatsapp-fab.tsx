"use client"

import { MessageCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

export function WhatsappFab() {
  const { t } = useLanguage()

  return (
    <a
      href="https://wa.me/966535533627"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("common.whatsapp")}
      className="fixed bottom-6 start-6 z-50 flex size-14 items-center justify-center rounded-full bg-[oklch(0.72_0.17_145)] text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="size-7" />
    </a>
  )
}
