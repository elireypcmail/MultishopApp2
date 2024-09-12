import Cookies from 'js-cookie'

const isClient = () => typeof window !== 'undefined'

const setCookie = (key: string, value: any) : void => { 
  Cookies.set(key, value, { expires: 7 }) 
}

const getCookie = (key: string, req?: any) : string | undefined => {
  if (isClient()) {
    return Cookies.get(key)
  } else if (req && req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').map((cookie: string) => cookie.trim())
    const cookie = cookies.find((cookie: string) => cookie.startsWith(`${key}=`))

    if (!cookie) return undefined

    return cookie.split('=')[1]
  }

  return undefined
}

const removeCookie = (key: string) : void => {  Cookies.remove(key) }

export { setCookie, getCookie, removeCookie }