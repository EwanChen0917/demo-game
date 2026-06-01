import Phaser from 'phaser'
import { useGameStore } from '@/stores/game'

export class GameScene extends Phaser.Scene {
  private tileGroup!: Phaser.GameObjects.Group
  private tileSize = 64
  private cols = 16
  private rows = 12
  private gameStore!: ReturnType<typeof useGameStore>

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    this.gameStore = useGameStore()
    this.drawGrid()

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const col = Math.floor(pointer.x / this.tileSize)
      const row = Math.floor(pointer.y / this.tileSize)
      if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
        this.highlightTile(col, row)
      }
    })

    this.drawLegend()
  }

  private drawGrid() {
    this.tileGroup = this.add.group()
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const x = col * this.tileSize
        const y = row * this.tileSize
        const isEven = (row + col) % 2 === 0
        const tile = this.add.rectangle(
          x + this.tileSize / 2,
          y + this.tileSize / 2,
          this.tileSize - 1,
          this.tileSize - 1,
          isEven ? 0x3a5a40 : 0x4a6a50,
        )
        tile.setStrokeStyle(1, 0x2a4a30)
        this.tileGroup.add(tile)
      }
    }
  }

  private highlightTile(col: number, row: number) {
    this.tileGroup.getChildren().forEach((child) => {
      const rect = child as Phaser.GameObjects.Rectangle
      rect.setFillStyle(
        (rect.y / this.tileSize + rect.x / this.tileSize) % 2 === 0 ? 0x3a5a40 : 0x4a6a50,
      )
    })

    const index = row * this.cols + col
    const target = this.tileGroup.getChildren()[index] as Phaser.GameObjects.Rectangle
    if (target) {
      target.setFillStyle(0xc8a96e)
      this.gameStore.selectTile(col, row)
    }
  }

  private drawLegend() {
    const legendItems = [
      { label: '空地', color: 0x3a5a40 },
      { label: '选中', color: 0xc8a96e },
    ]
    const baseX = 16
    const baseY = 768 - 16 - legendItems.length * 22 - 24
    this.add.text(baseX, baseY, '图例', {
      fontSize: '13px',
      color: '#f0d9b5',
      fontFamily: '"Noto Serif SC", serif',
    })
    legendItems.forEach((item, i) => {
      const ly = baseY + 20 + i * 22
      this.add.rectangle(baseX + 8, ly + 6, 12, 12, item.color)
      this.add.text(baseX + 20, ly, item.label, {
        fontSize: '12px',
        color: '#b8a88a',
        fontFamily: '"Noto Serif SC", serif',
      })
    })
  }
}
