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
  const [gameStarted, setGameStarted] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState(initialPlayers);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [hasReachedGoal, setHasReachedGoal] = useState(false);
  const [showGalleryHighlight, setShowGalleryHighlight] = useState(false);
  const [growthAnimation, setGrowthAnimation] = useState<{playerId: string, type: string} | null>(null);
  const [stepAnimation, setStepAnimation] = useState<number | null>(null);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [showDiceResult, setShowDiceResult] = useState(false);
  const [lastChancePlayer, setLastChancePlayer] = useState<string | null>(null);
  const [lastChanceResult, setLastChanceResult] = useState<{success: boolean, roll: number} | null>(null);
  const [skipNextTurn, setSkipNextTurn] = useState<Record<string, boolean>>({});
  const [completedArtworks, setCompletedArtworks] = useState<Record<string, {playerId: string, playerName: string, playerColor: string, artStyle: string, imageUrl: string}>>({});
  const [selectedArtwork, setSelectedArtwork] = useState<{playerId: string, playerName: string, playerColor: string, artStyle: string, imageUrl: string} | null>(null);


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

  const startGame = (count: number = 2) => {
    setPlayerCount(count);
    const gamePlayers = initialPlayers.slice(0, count);
    setPlayers(gamePlayers);
    
    setGameStarted(true);
    setCurrentTurn(0);
    setHasReachedGoal(false);
    setShowGalleryHighlight(false);
    setGrowthAnimation(null);
    setStepAnimation(null);
    setSkipNextTurn({});
    setCompletedArtworks({});
    setSelectedArtwork(null);
    setDiceRoll(null);
    setShowDiceResult(false);
    setLastChancePlayer(null);
    setLastChanceResult(null);
  };

  const getArtStyleFromStatus = (status: {感性: number, 技術力: number, 創造力: number}): string => {
    const { 感性, 技術力, 創造力 } = status;
    const total = 感性 + 技術力 + 創造力;
    
    if (total === 0) {
      const styles = ['キュビズム', '印象派', 'シュルレアリスム', '浮世絵'];
      return styles[Math.floor(Math.random() * styles.length)];
    }
    
    const 感性割合 = 感性 / total;
    const 技術力割合 = 技術力 / total;
    const 創造力割合 = 創造力 / total;
    
    if (技術力割合 >= 0.5) {
      return 'キュビズム';
    } else if (創造力割合 >= 0.5) {
      return 'シュルレアリスム';
    } else if (感性割合 >= 0.4 && 技術力割合 >= 0.3) {
      return '浮世絵';
    } else if (感性割合 >= 0.4) {
      return '印象派';
    } else {
      const maxValue = Math.max(感性, 技術力, 創造力);
      if (maxValue === 技術力) return 'キュビズム';
      if (maxValue === 創造力) return 'シュルレアリスム';
      if (maxValue === 感性) return '印象派';
      return '浮世絵';
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

  function handleLastChanceDiceRoll() {
    if (!lastChancePlayer) return;
    
    const lastChanceRoll = Math.floor(Math.random() * 6) + 1;
    const success = lastChanceRoll === 1; // 1が出れば経験値+2
    
    setLastChanceResult({ success, roll: lastChanceRoll });
    
    const player = players.find(p => p.id === lastChancePlayer);
    if (player) {
      if (success) {
        // 成功：経験値+2（感性、技術力、創造力のうちランダムに2つ増加）
        const statusTypes = ['感性', '技術力', '創造力'] as const;
        const randomStatus1 = statusTypes[Math.floor(Math.random() * statusTypes.length)];
        let randomStatus2 = statusTypes[Math.floor(Math.random() * statusTypes.length)];
        // 同じステータスが選ばれた場合は別のものを選択
        while (randomStatus2 === randomStatus1) {
          randomStatus2 = statusTypes[Math.floor(Math.random() * statusTypes.length)];
        }
        
        // 更新後のステータスを計算
        const updatedStatus = {
          ...player.status,
          [randomStatus1]: player.status[randomStatus1] + 1,
          [randomStatus2]: player.status[randomStatus2] + 1
        };
        
        const newTotalExp = updatedStatus.感性 + updatedStatus.技術力 + updatedStatus.創造力;
        
        // プレイヤーのステータスとポジションを同時に更新
        setPlayers(prev => prev.map(p => 
          p.id === lastChancePlayer 
            ? {
                ...p,
                status: updatedStatus,
                position: 81 // ゴール済みとしてマーク
              }
            : p
        ));
        
        // 作品制作判定
        if (newTotalExp >= 6) {
          // 十分な経験値になったので作品完成
          const artStyle = getArtStyleFromStatus(updatedStatus);
          const imageUrl = getRandomArtwork(artStyle);
          setCompletedArtworks(prev => ({
            ...prev,
            [lastChancePlayer]: {
              playerId: player.id,
              playerName: player.name,
              playerColor: player.color,
              artStyle: artStyle,
              imageUrl: imageUrl
            }
          }));
          setShowGalleryHighlight(true);
        } else {
          // まだ足りないので習作
          setCompletedArtworks(prev => ({
            ...prev,
            [lastChancePlayer]: {
              playerId: player.id,
              playerName: player.name,
              playerColor: player.color,
              artStyle: '習作',
              imageUrl: ''
            }
          }));
        }
      } else {
        // 失敗：習作
        setCompletedArtworks(prev => ({
          ...prev,
          [lastChancePlayer]: {
            playerId: player.id,
            playerName: player.name,
            playerColor: player.color,
            artStyle: '習作',
            imageUrl: ''
          }
        }));
        
        // ゴール済みとしてマーク
        setPlayers(prev => prev.map(p => 
          p.id === lastChancePlayer ? { ...p, position: 81 } : p
        ));
      }
      
      // 3秒後に演出をクリア
      setTimeout(() => {
        setLastChancePlayer(null);
        setLastChanceResult(null);
      }, 3000);
    }
  }

  function handleDiceRoll() {
    const activePlayers = players.filter(p => p.position < 81);
    
    if (activePlayers.length === 0) {
      return;
    }
    
    const currentActivePlayerIndex = currentTurn % activePlayers.length;
    const currentPlayer = activePlayers[currentActivePlayerIndex];
    const playerId = currentPlayer.id;
    
    if (skipNextTurn[playerId]) {
      setSkipNextTurn(prev => ({ ...prev, [playerId]: false }));
      const nextTurnIndex = (currentTurn + 1) % activePlayers.length;
      setCurrentTurn(nextTurnIndex);
      return;
    }
    
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(roll);
    setShowDiceResult(true);
    
    let targetPosition = Math.min(currentPlayer.position + roll, 80);
    
    while (galleryIndices.includes(targetPosition) && targetPosition < 80) {
      targetPosition = targetPosition + 1;
    }
    
    updatePlayerPosition(playerId, targetPosition);
    
    const square = mapSquares.find(s => s.number === targetPosition);
    
    setStepAnimation(targetPosition);
    setTimeout(() => {
      setStepAnimation(null);
      setShowDiceResult(false);
    }, 1200);
    
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
      
      setGrowthAnimation({playerId, type: growthType});
      setTimeout(() => setGrowthAnimation(null), 1500);
    }
    
    if (square?.type === 'rest') {
      setSkipNextTurn(prev => ({ ...prev, [playerId]: true }));
    }
    
    if (targetPosition === 80) {
      const player = players.find(p => p.id === playerId);
      if (player && !completedArtworks[playerId]) {
        const totalExperience = player.status.感性 + player.status.技術力 + player.status.創造力;
        const minimumRequirement = 6;
        
        // ラストチャンス判定（経験値が足りない場合）
        if (totalExperience < minimumRequirement) {
          setLastChancePlayer(playerId);
          // positionは80のままでラストチャンスを待つ
        } else {
          // 十分な経験値がある場合は通常通り
          const artStyle = getArtStyleFromStatus(player.status);
          const imageUrl = getRandomArtwork(artStyle);
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
          
          // 即座にゴール済みとしてマーク
          setPlayers(prev => prev.map(p => 
            p.id === playerId ? { ...p, position: 81 } : p
          ));
        }
        
        if (!hasReachedGoal) {
          setHasReachedGoal(true);
        }
      }
    }
    
    // ターン進行の処理（非同期で実行）
    setTimeout(() => {
      setPlayers(currentPlayers => {
        // ラストチャンス中のプレイヤーは80番地にいるが、まだアクティブ
        const finalActivePlayers = currentPlayers.filter(p => p.position < 81);
        if (finalActivePlayers.length > 0) {
          const nextTurnIndex = (currentTurn + 1) % finalActivePlayers.length;
          setCurrentTurn(nextTurnIndex);
        }
        return currentPlayers;
      });
    }, 100);
  }

  const GameBoard = () => {
    const activePlayers = players.filter(p => p.position < 81);
    const currentActivePlayer = activePlayers.length > 0 ? activePlayers[currentTurn % activePlayers.length] : null;

    return (
      <div className="grid grid-cols-9 grid-rows-9 gap-2 md:gap-3 w-[380px] md:w-[450px] relative mx-auto place-items-center">
        {Array.from({ length: 81 }, (_, i) => {
          const square = mapSquares.find(s => s.number === i);
          if (!square) {
            return <div key={i} className="w-[40px] h-[40px] md:w-[46px] md:h-[46px] box-border" />;
          }
          
          return (
            <Square
              key={square.number}
              square={square}
              players={players}
              stepAnimation={stepAnimation}
            />
          );
        })}

        <div
          className="absolute z-30 bg-gradient-to-br from-black/90 to-purple-950/90 border-2 border-amber-400/60 backdrop-blur-sm shadow-2xl rounded-lg flex flex-col items-center justify-center font-serif text-center"
          style={{
            width: 'clamp(105px, 13vw, 126px)',
            height: 'clamp(105px, 13vw, 126px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <h2 className="text-xs font-bold text-amber-200 mb-1 tracking-wide">✦ 芸術殿堂 ✦</h2>
          
          {Object.keys(completedArtworks).length > 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <p className="text-[8px] italic text-cyan-400 mb-1">展示作品</p>
              <div className="flex flex-wrap gap-0.5 justify-center max-w-[90px]">
                {Object.values(completedArtworks).map((artwork) => (
                  <div key={artwork.playerId} className="relative group cursor-pointer p-1 hover:bg-amber-400/10 rounded transition-all" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedArtwork(artwork);
                  }}>
                    {artwork.artStyle === '習作' ? (
                      <div 
                        className="w-6 h-6 rounded border bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-[8px] text-gray-300 shadow-sm hover:scale-105 transition-transform"
                        title={`${artwork.playerName}: 習作（経験不足）`}
                      >
                        習
                      </div>
                    ) : artwork.imageUrl ? (
                      <img
                        src={artwork.imageUrl}
                        alt={`${artwork.playerName}の${artwork.artStyle}作品`}
                        className="w-6 h-6 rounded border object-cover shadow-sm hover:scale-105 transition-transform"
                        title={`${artwork.playerName}: ${artwork.artStyle}`}
                      />
                    ) : null}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${artwork.playerColor.replace('border-', 'bg-')} border border-white`}></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <p className="text-[9px] italic text-gray-300/80 mb-1">魂の軌跡</p>
              <p className={`text-[8px] text-gray-400/70 transition-all duration-500 ${
                growthAnimation ? 'animate-pulse text-green-400' : ''
              }`}>
                {(() => {
                  if (activePlayers.length === 0) return '完了';
                  if (!currentActivePlayer) return '完了';
                  return `感性 ${currentActivePlayer.status.感性} ／ 技術 ${currentActivePlayer.status.技術力} ／ 創造 ${currentActivePlayer.status.創造力}`;
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

  const PlayerCountSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-slate-900 p-4 md:p-8 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-48 h-48 border-2 border-amber-400 rounded-full transform rotate-45"></div>
        <div className="absolute top-32 right-16 w-32 h-64 border border-amber-300 rounded-full transform -rotate-30"></div>
        <div className="absolute bottom-20 left-20 w-56 h-28 border border-amber-200 rounded-full transform rotate-15"></div>
      </div>
      
      <div className="relative z-10 text-center">
        <div className="mb-12">
          <h1 className="font-serif text-amber-100 mb-6 font-light">
            <span className="block text-lg md:text-2xl text-amber-400 font-light italic mb-3 whitespace-nowrap">〜 芸術の迷宮 〜</span>
            <span className="block font-bold text-3xl md:text-6xl whitespace-nowrap" style={{letterSpacing: '0.1em'}}>ART QUEST</span>
            <span className="block text-xl md:text-3xl text-amber-200 font-light mt-3 italic whitespace-nowrap">完全版 v2.1 - 4人プレイ対応</span>
          </h1>
        </div>
        
        <div className="bg-black/60 border border-amber-400/30 rounded-lg p-8 backdrop-blur-sm shadow-2xl max-w-md mx-auto">
          <h2 className="text-xl md:text-2xl font-serif text-amber-200 mb-8 tracking-wide">プレイヤー人数選択</h2>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[2, 3, 4].map(count => (
              <button
                key={count}
                onClick={() => setPlayerCount(count)}
                className={`py-3 px-4 rounded-lg font-serif font-semibold transition-all duration-300 border-2 ${
                  playerCount === count 
                    ? 'bg-amber-600 border-amber-400 text-black' 
                    : 'bg-purple-900/50 border-amber-400/30 text-amber-200 hover:border-amber-400/60'
                }`}
              >
                {count}人
              </button>
            ))}
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => startGame(playerCount)}
              className="w-full bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 hover:from-emerald-800 hover:to-emerald-800 text-amber-100 font-serif font-semibold py-3 px-6 rounded-lg shadow-xl transition-all duration-300 border-2 border-amber-400 hover:border-amber-300"
            >
              ゲーム開始
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!gameStarted) {
    return <PlayerCountSelection />;
  }

  const activePlayers = players.filter(p => p.position < 81);
  const currentActivePlayer = activePlayers.length > 0 ? activePlayers[currentTurn % activePlayers.length] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-slate-900 p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-48 h-48 border-2 border-amber-400 rounded-full transform rotate-45"></div>
        <div className="absolute top-32 right-16 w-32 h-64 border border-amber-300 rounded-full transform -rotate-30"></div>
        <div className="absolute bottom-20 left-20 w-56 h-28 border border-amber-200 rounded-full transform rotate-15"></div>
        <div className="absolute top-1/3 right-8 w-3 h-32 bg-gradient-to-b from-amber-400/30 to-transparent transform rotate-12"></div>
        <div className="absolute bottom-1/3 left-8 w-2 h-24 bg-gradient-to-t from-amber-300/20 to-transparent transform -rotate-20"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-amber-200/40 transform rotate-45"></div>
        <div className="absolute bottom-1/4 right-1/3 w-12 h-12 border border-amber-300/30 rounded-full"></div>
      </div>
      
      <div className="relative z-10">
        <div className="text-center mb-8 md:mb-12 px-4">
          <div className="max-w-sm md:max-w-2xl mx-auto">
            <h1 className="font-serif text-amber-100 mb-4 font-light">
              <span className="block text-sm md:text-xl text-amber-400 font-light italic mb-2 whitespace-nowrap">〜 芸術の迷宮 〜</span>
              <span className="block font-bold text-xl md:text-5xl whitespace-nowrap" style={{letterSpacing: '0.1em'}}>ART QUEST</span>
              <span className="block text-sm md:text-2xl text-amber-200 font-light mt-2 italic whitespace-nowrap">色彩の旅路</span>
            </h1>
          </div>
          
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
          <div className="flex flex-col items-center gap-4">
            {activePlayers.length === 0 ? (
              <div className="bg-black/50 border border-amber-400/30 rounded-lg px-6 py-3 backdrop-blur-sm shadow-lg">
                <span className="text-amber-100 font-serif text-base font-light tracking-wide">
                  🎊 全員ゴール達成！
                </span>
              </div>
            ) : currentActivePlayer && (
              <div className="bg-black/50 border border-amber-400/30 rounded-lg px-6 py-3 backdrop-blur-sm shadow-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-2 ${currentActivePlayer.color} flex items-center justify-center text-black font-bold text-sm shadow-md`}>
                    {currentActivePlayer.name[0]}
                  </div>
                  <span className="text-amber-100 font-serif text-base font-light tracking-wide">
                    {currentActivePlayer.name}の番
                  </span>
                  {skipNextTurn[currentActivePlayer.id] && (
                    <span className="text-amber-300 text-sm font-serif italic">💤 休息中</span>
                  )}
                </div>
              </div>
            )}

            <div className="relative">
              <GameBoard />
              
              {/* ラストチャンス演出エリア */}
              {lastChancePlayer && (
                <div className="absolute inset-0 flex items-center justify-center z-50">
                  <div className="bg-gradient-to-br from-yellow-100/95 to-amber-100/95 border-4 border-amber-400 rounded-xl p-8 shadow-2xl backdrop-blur-sm animate-pulse max-w-md text-center">
                    {!lastChanceResult ? (
                      <div className="space-y-4">
                        <div className="text-2xl font-serif text-amber-900 font-bold animate-bounce">
                          ✨ ラストチャンス ✨
                        </div>
                        <div className="text-lg font-serif text-amber-800 italic">
                          {players.find(p => p.id === lastChancePlayer)?.name}よ
                        </div>
                        <div className="text-base font-serif text-amber-700 leading-relaxed">
                          経験は足りないが<br />
                          運命の女神が微笑むかもしれない…
                        </div>
                        <div className="text-sm font-serif text-amber-600 italic">
                          サイコロで「1」が出れば経験値が2つ上昇！
                        </div>
                        <button
                          onClick={handleLastChanceDiceRoll}
                          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-serif font-bold py-3 px-6 rounded-lg shadow-xl transition-all duration-300 border-2 border-amber-800 hover:border-amber-900 hover:scale-105"
                        >
                          ⚃ 運命のサイコロを振る
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {lastChanceResult.success ? (
                          <>
                            <div className="text-3xl font-serif text-amber-900 font-bold animate-bounce">
                              🌟 奇跡の瞬間 🌟
                            </div>
                            <div className="text-xl font-serif text-amber-800 font-bold">
                              出目：{lastChanceResult.roll}
                            </div>
                            <div className="text-lg font-serif text-amber-700 italic leading-relaxed">
                              運命の扉が開かれた！<br />
                              魂に宿る経験が開花する
                            </div>
                            <div className="flex justify-center space-x-2">
                              <span className="text-2xl animate-bounce">✨</span>
                              <span className="text-2xl animate-bounce delay-100">🎨</span>
                              <span className="text-2xl animate-bounce delay-200">✨</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-2xl font-serif text-gray-700 font-bold">
                              ⚫ 静寂の調べ ⚫
                            </div>
                            <div className="text-xl font-serif text-gray-600">
                              出目：{lastChanceResult.roll}
                            </div>
                            <div className="text-lg font-serif text-gray-600 italic leading-relaxed">
                              運命は静かに扉を閉じた…<br />
                              されど習作に宿る魂あり
                            </div>
                            <div className="text-sm font-serif text-gray-500 italic">
                              すべての創作に意味がある
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {activePlayers.length > 0 && !lastChancePlayer && (
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={handleDiceRoll}
                  className="font-serif font-semibold px-8 py-3 rounded-full shadow-xl transform transition-all duration-300 border-2 bg-gradient-to-r from-black via-purple-900 to-black hover:from-purple-950 hover:to-purple-950 text-amber-100 border-amber-400 hover:border-amber-300 hover:shadow-amber-400/30 hover:scale-105"
                >
                  <span className="tracking-wider">
                    ⚃ 運命のサイコロ
                  </span>
                </button>
                
                {/* サイコロ結果表示 */}
                {showDiceResult && diceRoll && (
                  <div className="flex items-center gap-4 bg-black/70 border border-amber-400/40 rounded-lg px-6 py-3 backdrop-blur-sm shadow-xl animate-bounce">
                    {/* 芸術的なサイコロ表示 */}
                    <div className="relative animate-dice-appear">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-600 rounded-lg shadow-lg flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <div className="text-xl font-bold text-amber-900">
                          {diceRoll === 1 && '⚀'}
                          {diceRoll === 2 && '⚁'}
                          {diceRoll === 3 && '⚂'}
                          {diceRoll === 4 && '⚃'}
                          {diceRoll === 5 && '⚄'}
                          {diceRoll === 6 && '⚅'}
                        </div>
                      </div>
                      {/* キラキラエフェクト */}
                      <div className="absolute -top-1 -right-1 text-amber-400 animate-pulse">✨</div>
                      <div className="absolute -bottom-1 -left-1 text-amber-300 animate-pulse">✨</div>
                    </div>
                    
                    {/* 結果テキスト */}
                    <div className="text-center">
                      <p className="text-amber-300 font-serif text-lg font-bold">{diceRoll}</p>
                      <p className="text-amber-200 font-serif text-xs italic">
                        {diceRoll === 1 && '慎重な一歩'}
                        {diceRoll === 2 && '着実な歩み'}
                        {diceRoll === 3 && '心地よいリズム'}
                        {diceRoll === 4 && '力強い前進'}
                        {diceRoll === 5 && '躍動する魂'}
                        {diceRoll === 6 && '運命の導き'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="w-full max-w-6xl">
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
      
      {/* 作品鑑賞モーダル */}
      {selectedArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedArtwork(null)}>
          <div className="bg-gradient-to-br from-black/95 to-purple-950/95 border border-amber-400/40 rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-serif text-amber-200 mb-2">{selectedArtwork.playerName}の作品</h2>
                <p className="text-amber-400/80 text-sm font-serif italic">{selectedArtwork.artStyle}</p>
              </div>
              <button 
                onClick={() => setSelectedArtwork(null)}
                className="text-amber-400 hover:text-amber-300 transition-colors text-2xl font-light"
              >
                ×
              </button>
            </div>
            
            {selectedArtwork.artStyle === '習作' ? (
              <div className="text-center py-12">
                <div className="w-32 h-32 mx-auto rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-4xl text-gray-300 shadow-lg mb-4">
                  習
                </div>
                <p className="text-gray-400 font-serif">経験不足のため習作となりました</p>
                <p className="text-amber-400/60 text-sm mt-2">感性・技術力・創造力の合計が6以上で完成作品になります</p>
              </div>
            ) : selectedArtwork.imageUrl ? (
              <div className="text-center">
                <div className="w-full max-w-[500px] h-[500px] mx-auto relative overflow-hidden border p-2 rounded-lg shadow-xl border-amber-400/20 bg-black/20 flex items-center justify-center">
                  <img
                    src={selectedArtwork.imageUrl}
                    alt={`${selectedArtwork.playerName}の${selectedArtwork.artStyle}作品`}
                    className="w-full h-full object-contain max-w-full max-h-full"
                  />
                </div>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${selectedArtwork.playerColor.replace('border-', 'bg-')} shadow-md`}></div>
                  <span className="text-amber-300 font-serif">{selectedArtwork.playerName}</span>
                  <span className="text-amber-400/60">|</span>
                  <span className="text-amber-400 font-serif italic">{selectedArtwork.artStyle}</span>
                </div>
              </div>
            ) : null}
            
            <div className="mt-6 text-center">
              <button 
                onClick={() => setSelectedArtwork(null)}
                className="px-6 py-2 bg-gradient-to-r from-purple-900 to-purple-800 border border-amber-400/30 text-amber-200 rounded-lg hover:border-amber-400/50 transition-colors font-serif"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;