// eslint-disable-next-line prettier/prettier
export {}

declare global {
  interface String {
    toDateWithLocale: () => string
  }
}

String.prototype.toDateWithLocale = function (): string {
  const date = new Date(this.toString())
  const result = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return result
}
