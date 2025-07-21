# ART QUEST ビアズリー風デザインベース

## 🎨 デザインコンセプト
オーブリー・ビアズリーの美学にインスパイアされたアートヌーヴォー調のゲームUI

## 📁 保存ファイル

### メインファイル
- `src/App_beardsley_base.tsx` - メインアプリケーションコンポーネント
- `src/components/Square_beardsley_base.tsx` - ゲームマスコンポーネント

### 復元方法
```bash
# ベースデザインを復元する場合
cp src/App_beardsley_base.tsx src/App.tsx
cp src/components/Square_beardsley_base.tsx src/components/Square.tsx
```

## 🎨 デザイン特徴

### カラーパレット
- **背景**: スレート〜紫〜黒のグラデーション (`from-slate-900 via-purple-900 to-black`)
- **アクセント**: 琥珀色 (`amber-100` から `amber-700`)
- **テキスト**: 金色とクリーム色 (`amber-100`, `amber-300`)

### タイポグラフィ
- **メインフォント**: セリフ体 (`font-serif`)
- **階層構造**: タイトル、サブタイトル、装飾テキスト
- **文言**: 詩的で芸術的な表現

### UI要素
- **背景装飾**: アートヌーヴォー風の円形要素
- **ガラス効果**: `backdrop-blur-sm`, 半透明背景
- **グラデーション**: 複層的な色彩表現
- **アニメーション**: ホバー効果、パルス効果

### ゲーム要素
- **マス**: 琥珀色グラデーション、ホバー効果
- **プレイヤー**: 統一された金色アイコン
- **ギャラリー**: 「芸術殿堂」神秘的な中央表示
- **ボタン**: 「運命を転がす」詩的な表現

## 🔄 開発継続
このベースデザインを保持しつつ、以下の要素を段階的に追加可能：
- 追加ゲーム機能
- アニメーション強化
- サウンド効果
- 追加UI要素

## 📝 使用例
```typescript
// ベースデザインの復元
import App from './App_beardsley_base';

// または新機能との組み合わせ
import BaseSquare from './components/Square_beardsley_base';
```

最終更新: 2025年7月20日