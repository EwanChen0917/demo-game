import Phaser from 'phaser'

export interface BuildingDef {
  id: string
  name: string
  width: number
  height: number
  color: number
}

export function createBuildingTile(scene: Phaser.Scene, x: number, y: number, def: BuildingDef) {
  const rect = scene.add.rectangle(x, y, def.width, def.height, def.color)
  rect.setStrokeStyle(1, 0x000000)
  return rect
}
