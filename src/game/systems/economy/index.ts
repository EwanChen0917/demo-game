export interface PriceIndex {
  grain: number
  silk: number
  tea: number
  iron: number
}

export function simulatePrices(season: string): PriceIndex {
  const base: PriceIndex = { grain: 10, silk: 50, tea: 30, iron: 40 }
  if (season === '冬') base.grain *= 1.3
  if (season === '春') base.grain *= 0.8
  return base
}
