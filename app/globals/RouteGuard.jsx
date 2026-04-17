import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from '@g/SessionContext'

const LOGIN_PATHS = ['/', '/index']
const AUTH_HOME = '/date'

function isLoginPath(pathname) {
  if (!pathname) return false
  return LOGIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + '?'))
}

export default function RouteGuard({ children }) {
  const router = useRouter()
  const pathname = router?.pathname ?? router?.asPath?.split('?')[0]
  const { isReady, isAuthenticated } = useSession()

  useEffect(() => {
    if (!isReady) return

    const onLoginPage = isLoginPath(pathname)
    const authenticated = isAuthenticated()

    if (authenticated && onLoginPage) {
      router.replace(AUTH_HOME)
      return
    }
    if (!authenticated && !onLoginPage) {
      router.replace('/')
      return
    }
  }, [isReady, pathname, isAuthenticated, router])


  return children
}
