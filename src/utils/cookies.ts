import { NextPageContext } from "next"
import { RequestCookie, RequestCookies } from "next/dist/compiled/@edge-runtime/cookies"
import nookies, { destroyCookie, parseCookies, setCookie } from "nookies"

const DEFAULT_OPTIONS = {
  maxAge: 365 * 24 * 60 * 60, // 1 year
  path: "/"
}

const Cookies = {
  /**
   * Sets a cookie.
   * @param name The name of your cookie.
   * @param value The value of your cookie.
   * @param ctx NextJS page or API context, express context, null or undefined.
   */
  set: (name: string, value: string, ctx?: NextPageContext): void => {
    if (ctx) {
      nookies.set(ctx, name, value, DEFAULT_OPTIONS)
    } else {
      setCookie(null, name, value, DEFAULT_OPTIONS)
    }
  },

  /**
   * Get cookie by name/ key
   * @param name the name of the cookie
   * @param ctx Next.js context
   * @returns string | undefined
   */
  get: (name: string, ctx?: NextPageContext): string | undefined => {
    let cookies: { [index: string]: string } = {}

    if (ctx) {
      // @ts-ignore
      cookies = nookies.get(ctx, DEFAULT_OPTIONS)
    } else {
      // @ts-ignore
      cookies = parseCookies(null, DEFAULT_OPTIONS)
    }

    return cookies[name]
  },

  /**
   * Destroys cookie by their name
   * @param name Name/key of the cookie
   * @param ctx Next.js context
   */
  destroy: (name: string, ctx?: NextPageContext) => {
    if (ctx) nookies.destroy(ctx, name, DEFAULT_OPTIONS)
    else destroyCookie(null, name, DEFAULT_OPTIONS)
  },

  getServerSideCookies: (cookies: RequestCookies, key: string): string | undefined => {
    const cookie: RequestCookie | undefined = cookies.get(key)

    return cookie?.value
  }
}

export default Cookies
