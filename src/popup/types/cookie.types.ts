export type SameSite = 'no_restriction' | 'lax' | 'strict' | 'unspecified'

export interface ChromeCookie {
  name: string
  value: string
  domain: string
  path: string
  expirationDate?: number
  secure: boolean
  httpOnly: boolean
  sameSite: SameSite
  session: boolean
  storeId: string
}

export interface ChromeCookieInput {
  name: string
  value: string
  domain: string
  path: string
  expirationDate?: number
  secure: boolean
  httpOnly: boolean
  sameSite: SameSite
}
