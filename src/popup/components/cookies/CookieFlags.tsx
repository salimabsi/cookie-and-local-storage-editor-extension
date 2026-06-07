import type { SameSite } from '../../types/cookie.types'
import { Badge } from '../shared/Badge'

interface CookieFlagsProps {
  secure: boolean
  httpOnly: boolean
  sameSite: SameSite
}

const SAME_SITE_LABEL: Record<SameSite, string> = {
  strict: 'Strict',
  lax: 'Lax',
  no_restriction: 'None',
  unspecified: 'Unspecified',
}

export function CookieFlags({ secure, httpOnly, sameSite }: CookieFlagsProps) {
  return (
    <div className="flex items-center gap-1">
      {secure && <Badge title="Secure">S</Badge>}
      {httpOnly && <Badge title="HttpOnly">H</Badge>}
      {(sameSite === 'strict' || sameSite === 'lax') && (
        <Badge title={`SameSite: ${SAME_SITE_LABEL[sameSite]}`}>SS</Badge>
      )}
    </div>
  )
}
