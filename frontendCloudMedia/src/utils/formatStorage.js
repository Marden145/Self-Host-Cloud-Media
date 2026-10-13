const numberFormat = new Intl.NumberFormat('es-CR', { maximumFractionDigits: 1 })

export function formatGB(gb) {
  if (gb < 1) return `${numberFormat.format(Math.round(gb * 1024))} MB`
  return `${numberFormat.format(gb)} GB`
}