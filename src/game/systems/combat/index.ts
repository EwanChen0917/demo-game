export interface Army {
  commander: string
  infantry: number
  cavalry: number
  morale: number
}

export function battleOutcome(atk: Army, def: Army): 'win' | 'loss' | 'draw' {
  const atkPower = atk.infantry * 1 + atk.cavalry * 3 + atk.morale * 0.1
  const defPower = def.infantry * 1 + def.cavalry * 3 + def.morale * 0.1
  if (atkPower > defPower * 1.2) return 'win'
  if (defPower > atkPower * 1.2) return 'loss'
  return 'draw'
}
