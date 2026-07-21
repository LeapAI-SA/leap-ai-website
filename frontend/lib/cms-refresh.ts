export const SETTINGS_UPDATED_KEY = "leap-settings-updated"
export const CONTENT_UPDATED_KEY = "leap-content-updated"
export const SETTINGS_UPDATED_EVENT = "leap-settings-updated"
export const CONTENT_UPDATED_EVENT = "leap-content-updated"

export function notifySettingsUpdated() {
  if (typeof window === "undefined") return
  localStorage.setItem(SETTINGS_UPDATED_KEY, String(Date.now()))
  window.dispatchEvent(new Event(SETTINGS_UPDATED_EVENT))
}

export function notifyContentUpdated() {
  if (typeof window === "undefined") return
  localStorage.setItem(CONTENT_UPDATED_KEY, String(Date.now()))
  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT))
}

export function subscribeCmsUpdates(eventName: string, callback: () => void) {
  if (typeof window === "undefined") return () => {}

  const storageKey = eventName === SETTINGS_UPDATED_EVENT ? SETTINGS_UPDATED_KEY : CONTENT_UPDATED_KEY

  function onStorage(e: StorageEvent) {
    if (e.key === storageKey) callback()
  }

  window.addEventListener(eventName, callback)
  window.addEventListener("storage", onStorage)
  window.addEventListener("focus", callback)

  return () => {
    window.removeEventListener(eventName, callback)
    window.removeEventListener("storage", onStorage)
    window.removeEventListener("focus", callback)
  }
}
