# 吾今有世家 — 仿制 prototype

中国古代世家题材模拟经营 + 策略游戏原型。基于 Vue 3 + Phaser 3 + Pinia + Electron。

游戏设计大纲 → [docs/design.md](./docs/design.md)

## 技术栈

| 层 | 技术 | 作用 |
|---|---|---|
| 游戏引擎 | Phaser 3 | 2D 渲染、地图、建造、动画 |
| UI 框架 | Vue 3 (Composition API) | 所有界面面板、HUD |
| 状态管理 | Pinia | 多 store 分域管理游戏状态 |
| 构建工具 | Vite 6 | 开发服务器、热更新、打包 |
| 桌面壳 | Electron 33 | 打包为 Steam 可发行的桌面应用 |

## 架构

```
Phaser 画布层          Vue UI 层
(地图、建筑、人物)      (族谱、面板、菜单)
      ↕                    ↕
    ┌─────── Pinia stores ───────┐
    │  game  │ family │ economy │ diplomacy │
    └────────────────────────────┘
      ↕
    数据配置层 (data/)
    官职表、事件模板
```

Phaser 负责游戏世界的实时渲染，Vue 负责所有界面面板。两者通过 **多个 Pinia store** 通信——按业务域拆分，互不耦合。

## 快速开始

```bash
npm install
npm run dev            # 浏览器模式（HMR，开发最快）
npm run electron:dev   # Electron 桌面模式
npm run build          # 生产构建
```

## 项目结构

```
src/
├── game/                        # Phaser 渲染层
│   ├── index.ts                 # Phaser Game 实例工厂
│   ├── scenes/
│   │   └── GameScene.ts         # 主游戏场景
│   ├── systems/                 # 按系统分的游戏逻辑
│   │   ├── building/            # 建造系统
│   │   ├── combat/              # 战斗系统
│   │   └── economy/             # 经济模拟
│   └── entities/                # 游戏实体类型
│
├── stores/                      # Pinia 状态（按域拆分）
│   ├── game.ts                  # 核心状态：时间、选中地块
│   ├── family.ts                # 家族系统：成员、属性、繁衍
│   ├── economy.ts               # 经济系统：资产、收支
│   └── diplomacy.ts             # 外交系统：世家关系
│
├── components/                  # Vue UI 组件
│   ├── GameContainer.vue        # 核心容器：Phaser + 侧栏布局
│   ├── InfoPanel.vue            # 信息面板（家族概况 + 族人列表）
│   ├── family/                  # 族谱相关组件
│   ├── building/                # 建造面板组件
│   ├── court/                   # 朝堂 UI 组件
│   └── common/                  # 通用组件
│
├── data/                        # 静态配置数据
│   ├── officials.ts             # 文武官职表（九品十八级）
│   └── events.ts                # 随机事件模板
│
├── assets/styles/
│   └── main.css                 # 全局样式
│
├── App.vue                      # 根组件
└── main.ts                      # Vue 应用入口
```

## 目录设计原则

每个功能模块一个文件/目录，Pinia store 做粘合剂：

- **Phaser 层**只依赖 store，不直接引用 Vue 组件
- **Vue 层**也只依赖 store，不直接操作 Phaser
- **store 之间**可以相互引用（如 `game.ts` 调 `familyStore.onNewYear()`）
- 新增功能时，在对应域加 store + 组件 + 游戏系统即可

## Store 拆分说明

| Store | 职责 | 已含内容 |
|---|---|---|
| `game` | 游戏核心循环 | 年份/季节推进、地块选中 |
| `family` | 家族管理 | 成员属性、年龄增长、声望 |
| `economy` | 经济模拟 | 资产列表、收入计算 |
| `diplomacy` | 世家关系 | 世家生成、好感度 |

新增功能直接加新 store，不要往已有 store 里堆——保持每个 store 职责单一。

## 双向通信模式

```
Phaser → Vue:  Phaser 中调 store.selectTile()，Vue 自动响应
Vue → Phaser:  Vue 中调 store.advanceSeason()，Phaser 通过 $subscribe 更新画面
```

## 开发建议

1. **先用浏览器模式（`npm run dev`）开发**，HMR 快，调试方便
2. **先从纯文字/极简 UI 验证核心玩法**：家族养成 + 科举升官 + 世家关系
3. **美术资源**先用占位色块，玩法定下来再换正式素材
