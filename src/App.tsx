import React, { useState } from 'react';
import Square from './components/Square';
import { mapSquares, galleryIndices } from './mapData';

const initialPlayers = [
  {
    id: 'player1',
    name: '蔦屋軽三郎',
    icon: '/icons/player1.png',
    color: 'border-indigo-500',
    position: 0,
    status: {
      感性: 0,
      技術力: 0,
      創造力: 0,
    }
  },
  {
    id: 'player2',
    name: 'ピカーソ',
    icon: '/icons/player2.png',
    color: 'border-pink-500',
    position: 0,
    status: {
      感性: 0,
      技術力: 0,
      創造力: 0,
    }
  },
  {
    id: 'player3',
    name: 'モネの介',
    icon: '/icons/player3.png',
    color: 'border-green-500',
    position: 0,
    status: {
      感性: 0,
      技術力: 0,
      創造力: 0,
    }
  },
  {
    id: 'player4',
    name: 'ダリィ',
    icon: '/icons/player4.png',
    color: 'border-yellow-500',
    position: 0,
    status: {
      感性: 0,
      技術力: 0,
      創造力: 0,
    }
  },
];

const App = () => {
  const [players, setPlayers] = useState(initialPlayers);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [hasReachedGoal, setHasReachedGoal] = useState(false);
  const [showGalleryHighlight, setShowGalleryHighlight] = useState(false);
  const [growthAnimation, setGrowthAnimation] = useState<{playerId: string, type: string} | null>(null);
  const [stepAnimation, setStepAnimation] = useState<number | null>(null);
  const [skipNextTurn, setSkipNextTurn] = useState<Record<string, boolean>>({});
  const [completedArtworks, setCompletedArtworks] = useState<Record<string, {playerId: string, playerName: string, playerColor: string, artStyle: string, imageUrl: string}>>({});

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

  const getArtStyleFromStatus = (status: {感性: number, 技術力: number, 創造力: number}): string => {
    const { 感性, 技術力, 創造力 } = status;
    const total = 感性 + 技術力 + 創造力;
    
    // 最低限のステータスがない場合はランダム
    if (total === 0) {
      const styles = ['キュビズム', '印象派', 'シュルレアリスム', '浮世絵'];
      return styles[Math.floor(Math.random() * styles.length)];
    }
    
    // 各ステータスの割合を計算
    const 感性割合 = 感性 / total;
    const 技術力割合 = 技術力 / total;
    const 創造力割合 = 創造力 / total;
    
    // ステータス割合による判定
    if (技術力割合 >= 0.5) {
      return 'キュビズム'; // 技術力重視
    } else if (創造力割合 >= 0.5) {
      return 'シュルレアリスム'; // 創造力重視
    } else if (感性割合 >= 0.4 && 技術力割合 >= 0.3) {
      return '浮世絵'; // 感性と技術力のバランス
    } else if (感性割合 >= 0.4) {
      return '印象派'; // 感性重視
    } else {
      // バランス型は最高値で判定
      const maxValue = Math.max(感性, 技術力, 創造力);
      if (maxValue === 技術力) return 'キュビズム';
      if (maxValue === 創造力) return 'シュルレアリスム';
      if (maxValue === 感性) return '印象派';
      return '浮世絵'; // デフォルト
    }
  };

  const getRandomArtwork = (artStyle: string): string => {
    const artworks: Record<string, string[]> = {
      'キュビズム': [
        '/artworks/cubism/file_0000000000186230bdc3090b80e6800c.png',
        '/artworks/cubism/file_0000000008ac62309ac662efd6aa8a7d.png',
        '/artworks/cubism/file_00000000147061f8b3b0f0068b9cda1d.png',
        '/artworks/cubism/file_000000004c5461f98d195fb22add2584.png',
        '/artworks/cubism/file_000000005588622f96b2548c67594d01.png',
        '/artworks/cubism/file_00000000692861f8876774da852526fd.png',
        '/artworks/cubism/file_00000000e61861f7a71a4f56cb6193f4.png'
      ],
      '印象派': [
        '/artworks/impressionism/file_0000000048f86230aa77bfd9b03a3445.png',
        '/artworks/impressionism/file_000000005e30622fb828606d7f5579d6.png',
        '/artworks/impressionism/file_000000005f1461f784f41ae83d249fdb.png',
        '/artworks/impressionism/file_0000000082f062308eeeec9136ac4ce3.png',
        '/artworks/impressionism/file_000000008a2861fdbeb3eac38c79694d.png',
        '/artworks/impressionism/file_000000009adc6230b012f16f0c909562.png',
        '/artworks/impressionism/file_00000000f65861f6967f985961f29e67.png'
      ],
      'シュルレアリスム': [
        '/artworks/surrealism/file_00000000239461f5848ffc3c920d56be.png',
        '/artworks/surrealism/file_000000008480622faabbd7c403b69c11.png',
        '/artworks/surrealism/file_00000000caf4622f8f1c9f1a86849e53.png',
        '/artworks/surrealism/file_00000000d7b861f68e92ed95c0df522e.png',
        '/artworks/surrealism/file_00000000e11461f7a105613cecf7d6d1.png'
      ],
      '浮世絵': [
        '/artworks/ukiyo-e/file_00000000007c622fb1660a6debaa5daf.png',
        '/artworks/ukiyo-e/file_000000000cb86230ba5d95719f00caa6.png',
        '/artworks/ukiyo-e/file_00000000229861fd838f1b391a32ba43.png',
        '/artworks/ukiyo-e/file_00000000647c61f881237cea86234e1c.png',
        '/artworks/ukiyo-e/file_0000000069806230b9add556f1fa5dac.png',
        '/artworks/ukiyo-e/file_000000007cf46230b62bbc7091bd9a95.png',
        '/artworks/ukiyo-e/file_00000000919c61f68d43f0ae4ab973e8.png',
        '/artworks/ukiyo-e/file_00000000ad646230989e9e187d8413e0.png',
        '/artworks/ukiyo-e/file_00000000b334622f89c3c08be3441624.png'
      ]
    };
    
    const styleArtworks = artworks[artStyle] || [];
    if (styleArtworks.length === 0) return '';
    return styleArtworks[Math.floor(Math.random() * styleArtworks.length)];
  };

  function handleDiceRoll() {
    const activePlayers = players.filter(p => p.position < 80); // ゴールしていないプレイヤーのみ
    
    if (activePlayers.length === 0) {
      // 全員ゴールした場合
      return;
    }
    
    const currentActivePlayerIndex = currentTurn % activePlayers.length;
    const currentPlayer = activePlayers[currentActivePlayerIndex];
    const playerId = currentPlayer.id;
    
    // 一回休みチェック
    if (skipNextTurn[playerId]) {
      setSkipNextTurn(prev => ({ ...prev, [playerId]: false }));
      setCurrentTurn((prev) => (prev + 1) % activePlayers.length);
      return;
    }
    
    const roll = Math.floor(Math.random() * 6) + 1;
    const newPosition = Math.min(currentPlayer.position + roll, 80); // 80: ゴール番号
    updatePlayerPosition(playerId, newPosition);
    
    // 移動先のマスをチェック
    const square = mapSquares.find(s => s.number === newPosition);
    
    // ステップアニメーション
    setStepAnimation(newPosition);
    setTimeout(() => setStepAnimation(null), 600);
    
    if (square?.type === 'event' && square.growthType) {
      const growthType = square.growthType as '感性' | '技術力' | '創造力';
      setPlayers(prev => prev.map(player => 
        player.id === playerId 
          ? {
              ...player,
              status: {
                ...player.status,
                [growthType]: player.status[growthType] + 1,
              }
            }
          : player
      ));
      
      // 成長アニメーション
      setGrowthAnimation({playerId, type: growthType});
      setTimeout(() => setGrowthAnimation(null), 1500);
    }
    
    // 一回休みマスの処理
    if (square?.type === 'rest') {
      setSkipNextTurn(prev => ({ ...prev, [playerId]: true }));
    }
    
    // ゴール到達チェック
    if (newPosition === 80) {
      const player = players.find(p => p.id === playerId);
      if (player && !completedArtworks[playerId]) {
        const totalExperience = player.status.感性 + player.status.技術力 + player.status.創造力;
        const minimumRequirement = 6; // 最小経験値要件
        
        if (totalExperience >= minimumRequirement) {
          // 経験値が十分な場合：作品生成
          const artStyle = getArtStyleFromStatus(player.status);
          const imageUrl = getRandomArtwork(artStyle);
          console.log('作品完成:', player.name, 'ステータス:', player.status, '選択スタイル:', artStyle, '画像URL:', imageUrl);
          setCompletedArtworks(prev => ({
            ...prev,
            [playerId]: {
              playerId: player.id,
              playerName: player.name,
              playerColor: player.color,
              artStyle: artStyle,
              imageUrl: imageUrl
            }
          }));
          setShowGalleryHighlight(true);
        } else {
          // 経験値が不足している場合：習作として記録
          console.log('経験値不足:', player.name, '総経験値:', totalExperience, '最小要件:', minimumRequirement);
          setCompletedArtworks(prev => ({
            ...prev,
            [playerId]: {
              playerId: player.id,
              playerName: player.name,
              playerColor: player.color,
              artStyle: '習作',
              imageUrl: ''
            }
          }));
        }
        
        if (!hasReachedGoal) {
          setHasReachedGoal(true);
        }
      }
    }
    
    // 次のアクティブプレイヤーのターンに（ゴールしていないプレイヤーのみ）
    const updatedActivePlayers = players.filter(p => p.position < 80 || p.id === playerId); // 今ゴールした場合も含む
    const finalActivePlayers = updatedActivePlayers.filter(p => newPosition === 80 && p.id === playerId ? false : p.position < 80);
    
    if (finalActivePlayers.length > 0) {
      setCurrentTurn((prev) => (prev + 1) % finalActivePlayers.length);
    }
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
              stepAnimation={stepAnimation}
            />
          );
        })}

        {/* ギャラリー中央表示 */}
        <div
          className="absolute z-30 bg-gradient-to-br from-black/90 to-purple-950/90 border-2 border-amber-400/60 backdrop-blur-sm shadow-2xl rounded-lg pointer-events-none flex flex-col items-center justify-center font-serif text-center"
          style={{
            width: '126px',  // 42px × 3
            height: '126px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <h2 className="text-xs font-bold text-amber-200 mb-1 tracking-wide">✦ 芸術殿堂 ✦</h2>
          
          {Object.keys(completedArtworks).length > 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <p className="text-[8px] italic text-cyan-400 mb-1">展示作品</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {Object.values(completedArtworks).slice(0, 4).map((artwork, index) => (
                  <div key={artwork.playerId} className="relative group">
                    {artwork.artStyle === '習作' ? (
                      <div 
                        className="w-6 h-6 rounded border bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-[8px] text-gray-300 shadow-sm"
                        title={`${artwork.playerName}: 習作（経験不足）`}
                      >
                        習
                      </div>
                    ) : artwork.imageUrl ? (
                      <img
                        src={artwork.imageUrl}
                        alt={`${artwork.playerName}の${artwork.artStyle}作品`}
                        className="w-6 h-6 rounded border object-cover shadow-sm"
                        title={`${artwork.playerName}: ${artwork.artStyle}`}
                      />
                    ) : null}
                    <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ${artwork.playerColor.replace('border-', 'bg-')} border border-white`}></div>
                  </div>
                ))}
              </div>
              {Object.keys(completedArtworks).length > 4 && (
                <p className="text-[6px] text-gray-400 mt-1">+{Object.keys(completedArtworks).length - 4}作品</p>
              )}
            </div>
          ) : (
            <>
              <p className="text-[9px] italic text-gray-300/80 mb-1">魂の軌跡</p>
              <p className={`text-[8px] text-gray-400/70 transition-all duration-500 ${
                growthAnimation ? 'animate-pulse text-green-400' : ''
              }`}>
                {(() => {
                  const activePlayers = players.filter(p => p.position < 80);
                  if (activePlayers.length === 0) return '完了';
                  const currentPlayer = activePlayers[currentTurn % activePlayers.length];
                  return `感性 ${currentPlayer.status.感性} ／ 技術 ${currentPlayer.status.技術力} ／ 創造 ${currentPlayer.status.創造力}`;
                })()}
              </p>
            </>
          )}
          
          {showGalleryHighlight && (
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-cyan-500/20 animate-pulse rounded-xl z-40 pointer-events-none border border-cyan-400/40"></div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-slate-900 p-8 relative overflow-hidden">
      {/* ビアズリー風装飾背景 */}
      <div className="absolute inset-0 opacity-10">
        {/* 優雅な曲線装飾 */}
        <div className="absolute top-10 left-10 w-48 h-48 border-2 border-amber-400 rounded-full transform rotate-45"></div>
        <div className="absolute top-32 right-16 w-32 h-64 border border-amber-300 rounded-full transform -rotate-30"></div>
        <div className="absolute bottom-20 left-20 w-56 h-28 border border-amber-200 rounded-full transform rotate-15"></div>
        
        {/* アートヌーヴォー風の植物的要素 */}
        <div className="absolute top-1/3 right-8 w-3 h-32 bg-gradient-to-b from-amber-400/30 to-transparent transform rotate-12"></div>
        <div className="absolute bottom-1/3 left-8 w-2 h-24 bg-gradient-to-t from-amber-300/20 to-transparent transform -rotate-20"></div>
        
        {/* 幾何学装飾 */}
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-amber-200/40 transform rotate-45"></div>
        <div className="absolute bottom-1/4 right-1/3 w-12 h-12 border border-amber-300/30 rounded-full"></div>
      </div>
      
      <div className="relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-amber-100 mb-4 tracking-wider font-light">
            <span className="block text-xl text-amber-400 font-light italic mb-2 tracking-wide">〜 芸術の迷宮 〜</span>
            <span className="block font-bold tracking-widest">ART QUEST</span>
            <span className="block text-2xl text-amber-200 font-light mt-2 italic">色彩の旅路</span>
          </h1>
          
          {/* ビアズリー風装飾線 */}
          <div className="flex items-center justify-center mt-6 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-400"></div>
            <div className="mx-4 w-2 h-2 border border-amber-400 rounded-full"></div>
            <div className="w-32 h-px bg-amber-400"></div>
            <div className="mx-4 w-3 h-3 border border-amber-300 transform rotate-45"></div>
            <div className="w-32 h-px bg-amber-400"></div>
            <div className="mx-4 w-2 h-2 border border-amber-400 rounded-full"></div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-400"></div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          {/* ゲーム盤面エリア */}
          <div className="flex flex-col items-center gap-4">
            {/* 現在のターン表示 */}
            {(() => {
              const activePlayers = players.filter(p => p.position < 80);
              if (activePlayers.length === 0) {
                return (
                  <div className="bg-black/50 border border-amber-400/30 rounded-lg px-6 py-3 backdrop-blur-sm shadow-lg">
                    <span className="text-amber-100 font-serif text-base font-light tracking-wide">
                      🎊 全員ゴール達成！
                    </span>
                  </div>
                );
              }
              const currentPlayer = activePlayers[currentTurn % activePlayers.length];
              return (
                <div className="bg-black/50 border border-amber-400/30 rounded-lg px-6 py-3 backdrop-blur-sm shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-2 ${currentPlayer.color} flex items-center justify-center text-black font-bold text-sm shadow-md`}>
                      {currentPlayer.name[0]}
                    </div>
                    <span className="text-amber-100 font-serif text-base font-light tracking-wide">
                      {currentPlayer.name}の番
                    </span>
                    {skipNextTurn[currentPlayer.id] && (
                      <span className="text-amber-300 text-sm font-serif italic">💤 休息中</span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ゲーム盤面 */}
            <div className="relative">
              <GameBoard />
            </div>

            {/* サイコロボタン */}
            <button
              onClick={handleDiceRoll}
              className="bg-gradient-to-r from-black via-purple-900 to-black hover:from-purple-950 hover:to-purple-950 text-amber-100 font-serif font-semibold px-8 py-3 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-amber-400 hover:border-amber-300 hover:shadow-amber-400/30"
            >
              <span className="tracking-wider">⚃ 運命のサイコロ</span>
            </button>
          </div>

          {/* プレイヤーステータスエリア */}
          <div className="w-full max-w-6xl">
            {/* ビアズリー風タイトル装飾 */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400"></div>
                <div className="mx-3 w-1 h-1 border border-amber-400 rounded-full"></div>
                <h3 className="text-amber-200 font-serif text-xl font-light tracking-widest mx-4">
                  旅人たちの成長
                </h3>
                <div className="mx-3 w-1 h-1 border border-amber-400 rounded-full"></div>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {players.map((player) => (
                <div key={`${player.id}-${player.status.感性}-${player.status.技術力}-${player.status.創造力}`} 
                     className="bg-black/60 border border-amber-400/20 rounded-lg p-4 backdrop-blur-sm hover:bg-black/70 hover:border-amber-400/40 transition-all duration-300 shadow-lg">
                  {/* プレイヤー情報 */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-2 ${player.color} flex items-center justify-center text-black font-bold text-sm shadow-md`}>
                      {player.name[0]}
                    </div>
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) => updatePlayerName(player.id, e.target.value)}
                      className="bg-transparent border-none text-amber-100 text-sm font-serif placeholder-amber-400/50 focus:outline-none focus:text-amber-300 w-full tracking-wide"
                      placeholder="名前"
                    />
                  </div>

                  {/* ステータス */}
                  <div className="space-y-2">
                    <div className={`flex justify-between items-center text-sm transition-all duration-300 ${
                      growthAnimation?.playerId === player.id && growthAnimation.type === '感性' 
                        ? 'animate-bounce text-amber-300 font-bold' : 'text-amber-200'
                    }`}>
                      <span className="font-serif font-light tracking-wide">感性</span>
                      <span className="font-serif font-semibold">{player.status.感性}</span>
                    </div>
                    <div className={`flex justify-between items-center text-sm transition-all duration-300 ${
                      growthAnimation?.playerId === player.id && growthAnimation.type === '技術力' 
                        ? 'animate-bounce text-amber-300 font-bold' : 'text-amber-200'
                    }`}>
                      <span className="font-serif font-light tracking-wide">技術力</span>
                      <span className="font-serif font-semibold">{player.status.技術力}</span>
                    </div>
                    <div className={`flex justify-between items-center text-sm transition-all duration-300 ${
                      growthAnimation?.playerId === player.id && growthAnimation.type === '創造力' 
                        ? 'animate-bounce text-amber-300 font-bold' : 'text-amber-200'
                    }`}>
                      <span className="font-serif font-light tracking-wide">創造力</span>
                      <span className="font-serif font-semibold">{player.status.創造力}</span>
                    </div>
                    
                    {/* 芸術傾向と経験値状況 */}
                    {(player.status.感性 + player.status.技術力 + player.status.創造力) > 0 && (
                      <div className="mt-3 pt-3 border-t border-amber-400/20">
                        <p className="text-xs text-amber-300 text-center italic font-serif tracking-wider">
                          {getArtStyleFromStatus(player.status)}
                        </p>
                        {(() => {
                          const totalExp = player.status.感性 + player.status.技術力 + player.status.創造力;
                          const minReq = 6;
                          if (totalExp >= minReq) {
                            return (
                              <p className="text-[10px] text-green-400 text-center mt-1">
                                ✓ 作品制作可能
                              </p>
                            );
                          } else {
                            return (
                              <p className="text-[10px] text-yellow-400 text-center mt-1">
                                経験値: {totalExp}/{minReq}
                              </p>
                            );
                          }
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;