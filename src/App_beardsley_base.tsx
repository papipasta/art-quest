import React, { useState } from 'react';
import Square from './components/Square';
import { mapSquares, galleryIndices } from './mapData';

const initialPlayers = [
  {
    id: 'player1',
    name: 'コウキ',
    icon: '/icons/koki.png', // 個別アイコン
    color: 'border-indigo-500',
    position: 0,
  },
  {
    id: 'player2',
    name: 'ユイ',
    icon: '/icons/yui.png',
    color: 'border-pink-500',
    position: 5,
  },
];

const App = () => {
  const [players, setPlayers] = useState(initialPlayers);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [status, setStatus] = useState<Record<string, { 感性: number; 技術力: number; 創造力: number }>>({
    'player1': { 感性: 0, 技術力: 0, 創造力: 0 },
    'player2': { 感性: 0, 技術力: 0, 創造力: 0 },
  });
  const [hasReachedGoal, setHasReachedGoal] = useState(false);
  const [showGalleryHighlight, setShowGalleryHighlight] = useState(false);

  const updatePlayerPosition = (playerId: string, newPosition: number) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId ? { ...player, position: newPosition } : player
      )
    );
  };

  const updatePlayerName = (playerId: string, newName: string) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId ? { ...player, name: newName } : player
      )
    );
  };

  function handleDiceRoll() {
    const roll = Math.floor(Math.random() * 6) + 1;
    const playerId = players[currentTurn].id;
    const newPosition = Math.min(players[currentTurn].position + roll, 80); // 80: ゴール番号
    updatePlayerPosition(playerId, newPosition);
    
    // 移動先のマスをチェック
    const square = mapSquares.find(s => s.number === newPosition);
    if (square?.type === 'event' && square.growthType) {
      const growthType = square.growthType as '感性' | '技術力' | '創造力';
      setStatus(prev => ({
        ...prev,
        [playerId]: {
          ...prev[playerId],
          [growthType]: prev[playerId][growthType] + 1,
        },
      }));
    }
    
    // ゴール到達チェック
    const updatedPlayer = players.find(p => p.id === playerId);
    if (updatedPlayer && newPosition === 80 && !hasReachedGoal) {
      setHasReachedGoal(true);
      setShowGalleryHighlight(true);
    }
    
    // 次のプレイヤーのターンに
    setCurrentTurn((prev) => (prev + 1) % players.length);
  }

  const squareSize = 44; // マスのサイズ
  const gallerySize = 126; // ギャラリーのサイズ

  const GameBoard = () => {
    return (
      <div className="grid grid-cols-9 grid-rows-9 gap-[2px] w-[400px] relative mx-auto">
        {/* マス描画 */}
        {Array.from({ length: 81 }, (_, i) => {
          if (galleryIndices.includes(i)) {
            return <div key={i} className="w-[44px] h-[44px]"></div>; // 空のスペース
          }
          
          const square = mapSquares.find(s => s.number === i);
          if (!square) return <div key={i} className="w-[44px] h-[44px]" />;
          
          return (
            <Square
              key={square.number}
              square={square}
              players={players.filter(p => p.position === square.number)}
            />
          );
        })}

        {/* ギャラリー中央表示 */}
        <div
          className="absolute z-30 bg-gradient-to-br from-black/80 to-purple-900/80 border-2 border-amber-300/60 backdrop-blur-sm shadow-2xl rounded-xl pointer-events-none flex flex-col items-center justify-center font-serif text-center"
          style={{
            width: '126px',  // 42px × 3
            height: '126px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <h2 className="text-xs font-bold text-amber-100 mb-1">✦ 芸術殿堂 ✦</h2>
          <p className="text-[9px] italic text-amber-300/80 mb-1">魂の軌跡</p>
          <p className="text-[8px] text-amber-200/70">
            感性 0 ／ 技術 0 ／ 創造 0
          </p>
          {showGalleryHighlight && (
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-amber-600/20 animate-pulse rounded-xl z-40 pointer-events-none border border-amber-300/40"></div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black p-8 relative overflow-hidden">
      {/* アートヌーヴォー風装飾背景 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 border-2 border-amber-300 rounded-full transform rotate-12"></div>
        <div className="absolute top-20 right-10 w-24 h-48 border border-amber-300 rounded-full transform -rotate-45"></div>
        <div className="absolute bottom-10 left-10 w-40 h-20 border border-amber-300 rounded-full transform rotate-30"></div>
      </div>
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-amber-100 mb-2 tracking-wide">
            <span className="block text-lg text-amber-300 font-light italic">〜 芸術の迷宮 〜</span>
            ART QUEST
            <span className="block text-xl text-amber-300 font-light">色彩の旅路</span>
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto mt-4"></div>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="bg-black/40 border border-amber-300/30 rounded-lg px-6 py-3 backdrop-blur-sm">
            <p className="text-amber-100 font-serif italic text-center">
              現在の旅人：<span className="text-amber-300 font-semibold">{players[currentTurn].name}</span>
            </p>
          </div>
          
          <GameBoard />
          
          {/* プレイヤーステータス表示 */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-md">
            {players.map((player) => (
              <div key={player.id} className="bg-black/60 border border-amber-300/40 rounded-lg p-4 backdrop-blur-sm shadow-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center text-black font-bold text-sm">
                    {player.name[0]}
                  </div>
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => updatePlayerName(player.id, e.target.value)}
                    className="bg-black/50 border border-amber-300/40 rounded px-3 py-1 text-amber-100 text-sm w-[120px] placeholder-amber-400/60 focus:border-amber-300 focus:outline-none"
                    placeholder="名前を入力"
                  />
                </div>
                <div className="space-y-1 text-sm font-serif">
                  <p className="text-amber-100">
                    <span className="text-amber-300">感性</span>：{status[player.id].感性}
                  </p>
                  <p className="text-amber-100">
                    <span className="text-amber-300">技術力</span>：{status[player.id].技術力}
                  </p>
                  <p className="text-amber-100">
                    <span className="text-amber-300">創造力</span>：{status[player.id].創造力}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={handleDiceRoll}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-serif font-bold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 border border-amber-400"
          >
            ⚃ 運命を転がす
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;