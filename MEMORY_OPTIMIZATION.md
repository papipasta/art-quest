# ART QUEST - メモリ最適化ガイド

## JavaScript heap out of memory エラー対策

このプロジェクトは大量の画像ファイルとリアルタイム状態更新を扱うため、メモリ使用量が多くなる可能性があります。

### 最適化済み機能

#### 1. 画像のLazy Loading
- 画像パスは必要時のみ動的に生成
- 全てのアートワーク配列を事前に読み込まない
- メモリ使用量を大幅削減

#### 2. React メモ化最適化
- `useMemo`, `useCallback`, `memo` を使用した再レンダリング最適化
- アクティブプレイヤー計算のメモ化
- 不要な関数実行を削減

#### 3. 完成作品の制限
- 展示作品を最大8個に制限
- 古い作品は自動的にメモリから解放
- ギャラリー表示の最適化

### 実行方法

#### 通常実行
```bash
npm start
```

#### メモリ拡張実行（推奨）
```bash
npm run start:memory
```

#### ビルド
```bash
npm run build:memory
```

### NODE_OPTIONS設定

#### 環境変数設定（Windows）
```cmd
set NODE_OPTIONS=--max-old-space-size=4096
npm start
```

#### 環境変数設定（Linux/Mac）
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm start
```

#### 直接実行
```bash
node --max-old-space-size=4096 node_modules/.bin/react-scripts start
```

### メモリ使用量監視

開発者ツールでメモリ使用量を監視できます：
1. F12 → Memory タブ
2. Take heap snapshot でメモリ状況確認
3. Performance タブでメモリリークチェック

### トラブルシューティング

#### エラーが続く場合
1. `npm run start:memory` を使用
2. NODE_OPTIONS を 6144 または 8192 に増加
3. 画像ファイル数を削減
4. ブラウザのキャッシュをクリア

#### パフォーマンス向上
- React DevTools Profiler で再レンダリング確認
- 不要な状態更新を削減
- 画像の事前読み込みを避ける

### 依存関係

- `cross-env`: クロスプラットフォーム環境変数設定
- React 19: 最新の最適化機能を活用
- TypeScript: 型安全性とパフォーマンス