// eslint-disable-next-line prettier/prettier
export {}

declare global {
  interface Number {
    toCurrency: () => string
    getDigits: () => string
    getCents: () => string
    getCurrencySymbol: () => string
  }
}

Number.prototype.toCurrency = function (): string {
  const result = this.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })

  return result
}

Number.prototype.getDigits = function (): string {
  const currency = this.toCurrency()
  const notCurrency = currency.replaceAll(/[^0-9.,]/g, '')
  return notCurrency.substring(0, notCurrency.length - 3)
}

Number.prototype.getCents = function (): string {
  const currency = this.toCurrency()
  return currency.slice(-2)
}

Number.prototype.getCurrencySymbol = function (): string {
  const currency = this.toCurrency()
  return currency.replaceAll(/[0-9.,]/g, '')
}
