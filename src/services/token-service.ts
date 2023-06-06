import jwt_decode from 'jwt-decode'
import { setCookie } from 'nookies'

import { ClaimsType } from '@/types/claims-type'
import { TokenType } from '@/types/token-type'

export default function TokenService() {
  function SetCookieFromToken(cookieName: string, token: string) {
    const expires = expiresToken(token)
    if (!expires) return

    setCookie(undefined, cookieName, token, { path: '/', expires: expires })
  }

  function expiresToken(token: string) {
    const _token = ReadToken(token)
    if (!_token) return

    return new Date(_token.exp * 1000)
  }

  function ReadToken(accessToken: string) {
    const token: TokenType = jwt_decode(accessToken)
    return token ? token : null
  }

  function ValidateClaims(
    userClaims: ClaimsType[],
    type: string,
    value: string
  ) {
    const typeUserClaimFound = userClaims.find(
      (userClaim) => userClaim.type == type
    )
    if (!typeUserClaimFound) return false

    const valueUserClaimsSplitted = typeUserClaimFound.value.split(',')
    if (!valueUserClaimsSplitted) return false

    const valueClaimSplitted = value.split(',')

    return valueClaimSplitted.every((valueClaim) =>
      valueUserClaimsSplitted.includes(valueClaim)
    )
  }

  return { SetCookieFromToken, ReadToken, ValidateClaims }
}
