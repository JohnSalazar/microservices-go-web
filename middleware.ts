import { NextRequest, NextResponse } from 'next/server'

import ConfigService from './src/services/config-service'
import TokenService from './src/services/token-service'
import { ClaimsType } from './src/types/claims-type'
import { ProceedType } from './src/types/proceed-type'
import { ProtectedURLType } from './src/types/protected-url-type'

const protectedURL: ProtectedURLType[] = [
  {
    pathName: '/checkout',
    claims: [],
  },
  {
    pathName: '/manager',
    claims: [
      { type: 'coupon', value: 'read' },
      { type: 'product', value: 'read' },
      { type: 'user', value: 'read' },
    ],
  },
  {
    pathName: '/manager/coupons',
    claims: [{ type: 'coupon', value: 'read,create,update' }],
  },
  {
    pathName: '/manager/products',
    claims: [{ type: 'product', value: 'read,create,update' }],
  },
  {
    pathName: '/manager/profile',
    claims: [{ type: 'user', value: 'create,read,update' }],
  },
  {
    pathName: '/manager/users',
    claims: [{ type: 'admin', value: 'read,create,update' }],
  },
  {
    pathName: '/orders',
    claims: [],
  },
  {
    pathName: '/profile',
    claims: [],
  },
  {
    pathName: '/test',
    claims: [],
  },
]

const sortedURL = protectedURL.sort((a, b) =>
  a.pathName > b.pathName ? 1 : -1
)

export const config = {
  matcher: '/((?!api/upload)(?!_next).*)',
}

const { GetConfig } = ConfigService()
const configFile = GetConfig()

const { ReadToken, ValidateClaims } = TokenService()

export const middleware = async (request: NextRequest) => {
  const { proceed, redirect } = validateRequest(request)
  if (!proceed) {
    return NextResponse.redirect(new URL(redirect, request.url))
  }
}

const validateRequest = (request: NextRequest): ProceedType => {
  const pathName = request.nextUrl.pathname
  const urlFound = sortedURL.find((path) => path.pathName == pathName)

  if (urlFound) {
    return Verify(request, urlFound.claims)
  }

  return { proceed: true, redirect: pathName }
  // return { proceed: true, redirect: '' }
}

export function Verify(
  request: NextRequest,
  urlClaims: ClaimsType[]
): ProceedType {
  const accessToken = request.cookies.get(configFile.accessTokenName)
  if (!accessToken)
    return {
      proceed: false,
      redirect: `/signin?returnURL=${request.nextUrl.pathname}`,
    }

  const token = ReadToken(accessToken)
  if (!token)
    return {
      proceed: false,
      redirect: `/signin?returnURL=${request.nextUrl.pathname}`,
    }

  if (urlClaims.length > 0) {
    const userClaims = token.claims

    if (!userClaims || userClaims.length == 0)
      return { proceed: false, redirect: '/accessdenied' }

    const sortedUserClaims = userClaims.sort((a, b) =>
      a.value > b.value ? 1 : -1
    )

    const claimsFound: boolean[] = []
    urlClaims.forEach((claim) => {
      const typeUserFound = ValidateClaims(
        sortedUserClaims,
        claim.type,
        claim.value
      )
      if (typeUserFound) claimsFound.push(true)
    })

    return claimsFound.length == urlClaims.length
      ? { proceed: true, redirect: '' }
      : { proceed: false, redirect: '/accessdenied' }
  }

  // return { proceed: true, redirect: '' }
  return { proceed: true, redirect: request.nextUrl.pathname }
}
