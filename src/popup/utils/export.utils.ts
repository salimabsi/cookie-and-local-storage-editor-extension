import type { ChromeCookie } from '../types/cookie.types'
import type { StorageEntry } from '../types/storage.types'

const EXPORT_VERSION = 1

export interface ExportData {
  version: number
  exportedAt: string
  domain: string
  cookies: ChromeCookie[]
  localStorage: StorageEntry[]
  sessionStorage: StorageEntry[]
}

export function buildExportData(
  domain: string,
  cookies: ChromeCookie[],
  localStorage: StorageEntry[],
  sessionStorage: StorageEntry[],
): ExportData {
  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    domain,
    cookies,
    localStorage,
    sessionStorage,
  }
}

export function exportFilename(domain: string): string {
  const safeDomain = domain.replace(/[^a-z0-9.-]/gi, '_')
  const date = new Date().toISOString().slice(0, 10)
  return `devstorage-${safeDomain}-${date}.json`
}

export function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
