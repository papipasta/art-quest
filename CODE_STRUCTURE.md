# 🔧 ART QUEST - コード構成詳細

## 📋 メインファイル解析

### 🎯 App.tsx (857行) - メインロジック

#### 状態管理 (useState)
```typescript
// ゲーム基本状態
const [gameStarted, setGameStarted] = useState(false);
const [playerCount, setPlayerCount] = useState(2);
const [players, setPlayers] = useState(initialPlayers);
const [currentTurn, setCurrentTurn] = useState(0);

// ゲーム進行状態
const [hasReachedGoal, setHasReachedGoal] = useState(false);
const [showGalleryHighlight, setShowGalleryHighlight] = useState(false);
const [stepAnimation, setStepAnimation] = useState<number | null>(null);
const [diceRoll, setDiceRoll] = useState<number | null>(null);

// 特殊機能状態
const [lastChancePlayer, setLastChancePlayer] = useState<string | null>(null);
const [lastChanceResult, setLastChanceResult] = useState<{success: boolean, roll: number} | null>(null);
const [skipNextTurn, setSkipNextTurn] = useState<Record<string, boolean>>({});
const [completedArtworks, setCompletedArtworks] = useState<Record<string, CompleteArtwork>>({});
const [selectedArtwork, setSelectedArtwork] = useState<CompleteArtwork | null>(null);
```

#### 主要関数
1. **ゲーム制御**
   - `startGame()` - ゲーム初期化
   - `updatePlayerPosition()` - プレイヤー移動
   - `updatePlayerName()` - 名前変更

2. **サイコロ・移動ロジック**
   - `handleDiceRoll()` - メインゲームロジック
   - `handleLastChanceDiceRoll()` - ラストチャンス処理

3. **芸術システム**
   - `getArtStyleFromStatus()` - スタイル判定
   - `getRandomArtwork()` - 作品画像選択

#### コンポーネント構成
```typescript
// メインアプリ構造
App
├── PlayerCountSelection (人数選択)
│   ├── ルール説明 (4つのアイコン説明)
│   └── プレイヤー選択ボタン
├── GameBoard (メインゲーム)
│   ├── Square[] (81個のマス)
│   ├── 芸術殿堂 (中央ギャラリー)
│   └── サイコロボタン
├── プレイヤー情報パネル
└── 作品鑑賞モーダル
```

### 🎲 mapData.ts - ゲームボードデータ

```typescript
// マス定義
export const mapSquares = [
  { number: 0, type: 'start', position: { x: 0, y: 8 } },
  // ... 80個のマス定義
  { number: 80, type: 'goal', position: { x: 0, y: 0 } }
];

// ギャラリーマス (作品展示エリア)
export const galleryIndices = [31, 32, 39, 40, 41, 48, 49];
```

### 🎨 Square.tsx - マス表示コンポーネント

```typescript
// マスタイプ別スタイリング
const getSquareStyle = (type: string, number: number) => {
  // テーマゾーン判定
  if (num >= 10 && num <= 20) return キュビズムゾーン;
  if (num >= 25 && num <= 35) return 印象派ゾーン;
  if (num >= 40 && num <= 50) return シュルレアリスムゾーン;
  if (num >= 55 && num <= 65) return 浮世絵ゾーン;
  
  // マスタイプ別処理
  switch(type) {
    case 'start': return スタートマス;
    case 'goal': return ゴールマス;
    case 'event': return イベントマス;
    case 'rest': return 休憩マス;
  }
};
```

## 🎨 スタイル構成

### index.css - アニメーション定義
```css
/* カスタムアニメーション */
@keyframes dice-appear { /* サイコロ表示 */ }
@keyframes fade-in-out { /* フェード効果 */ }
@keyframes last-chance-glow { /* ラストチャンス演出 */ }
```

### Tailwind設定
```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // カスタムカラーパレット
      colors: {
        amber: { /* 金色テーマ */ },
        purple: { /* 紫テーマ */ }
      }
    }
  }
}
```

## 🗃️ データ構造

### プレイヤーオブジェクト
```typescript
interface Player {
  id: string;           // 'player1', 'player2', etc.
  name: string;         // 表示名
  icon: string;         // アイコンパス
  color: string;        // 'border-indigo-500'
  position: number;     // 0-81 (ボード位置)
  status: {
    感性: number;
    技術力: number;
    創造力: number;
  };
}
```

### 作品オブジェクト
```typescript
interface CompleteArtwork {
  playerId: string;
  playerName: string;
  playerColor: string;
  artStyle: string;     // 'キュビズム' | '印象派' | etc.
  imageUrl: string;     // 画像パス
}
```

### マスオブジェクト
```typescript
interface Square {
  number: number;       // 0-80
  type: 'start' | 'goal' | 'event' | 'rest' | 'normal';
  position: { x: number; y: number }; // グリッド座標
  growthType?: '感性' | '技術力' | '創造力'; // イベントマス用
}
```

## 🔄 ゲームフロー

### 1. 初期化
```
PlayerCountSelection → startGame() → GameBoard表示
```

### 2. ターン処理
```
handleDiceRoll() → 
  サイコロ振る → 
  プレイヤー移動 → 
  マス効果適用 → 
  ターン切り替え
```

### 3. ゴール処理
```
position === 80 → 
  経験値チェック → 
  (充分) 作品完成 / (不足) ラストチャンス → 
  ギャラリー追加
```

## 🚀 ビルド・デプロイ設定

### package.json スクリプト
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "deploy": "gh-pages -d build",
    "vercel-build": "react-scripts build"
  }
}
```

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "create-react-app"
}
```

## 📊 パフォーマンス指標

### ビルドサイズ (gzip圧縮後)
- **JavaScript**: 65.65kB
- **CSS**: 7.39kB
- **画像アセット**: 117MB
- **総ファイル数**: 63ファイル

### 最適化項目
- ✅ 画像の遅延読み込み
- ✅ 不要なアニメーション削除
- ✅ CSSの最小化
- ✅ TypeScriptの型安全性

---

**📋 このドキュメントは、ART QUESTの完全なコード理解と保守のための技術資料です。**