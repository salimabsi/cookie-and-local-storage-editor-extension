import type { ChromeCookie, ChromeCookieInput } from '../types/cookie.types'

/** Builds the URL chrome.cookies.set/remove require, derived from the cookie's own domain/path/secure flag. */
export function buildCookieUrl(domain: string, path: string, secure: boolean): string {
  const host = domain.startsWith('.') ? domain.slice(1) : domain
  return `${secure ? 'https' : 'http'}://${host}${path}`
}

export function cookieRowId(cookie: Pick<ChromeCookie, 'name' | 'domain' | 'path'>): string {
  return `${cookie.name}|${cookie.domain}|${cookie.path}`
}

export function cookieToInput(cookie: ChromeCookie): ChromeCookieInput {
  return {
    name: cookie.name,
    value: cookie.value,
    domain: cookie.domain,
    path: cookie.path,
    expirationDate: cookie.expirationDate,
    secure: cookie.secure,
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite,
  }
}

export function emptyCookieInput(domain: string): ChromeCookieInput {
  return {
    name: '',
    value: '',
    domain,
    path: '/',
    secure: false,
    httpOnly: false,
    sameSite: 'lax',
  }
}
