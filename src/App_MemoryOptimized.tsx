import React, { useState, useMemo, useCallback, lazy, Suspense } from 'react';
import Square from './components/Square';
import { mapSquares, galleryIndices } from './mapData';

// 画像の遅延読み込み用コンポーネント
const LazyArtworkImage = lazy(() => Promise.resolve({
  default: ({ src, alt, className, title }: { src: string; alt: string; className: string; title: string }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    return (
      <div className="w-6 h-6 relative overflow-hidden border p-2 rounded bg-gray-800/50 flex items-center justify-center">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center text-[6px] text-gray-400 animate-pulse">
            ...
          </div>
        )}
        {!imageError && (
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-contain max-w-full max-h-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            title={title}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
            }}
            loading="lazy"
          />
        )}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center text-[6px] text-red-300 bg-red-900/50">
            ✗
          </div>
        )}
      </div>
    );
  }
}));

const initialPlayersMinimal = [
  { id: 'player1', name: '蔦屋軽三郎', color: 'border-indigo-500', position: 0, status: { 感性: 0, 技術力: 0, 創造力: 0 } },
  { id: 'player2', name: 'ピカーソ', color: 'border-pink-500', position: 0, status: { 感性: 0, 技術力: 0, 創造力: 0 } },
  { id: 'player3', name: 'モネの介', color: 'border-green-500', position: 0, status: { 感性: 0, 技術力: 0, 創造力: 0 } },
  { id: 'player4', name: 'ダリィ', color: 'border-yellow-500', position: 0, status: { 感性: 0, 技術力: 0, 創造力: 0 } },
];

// アート作品のメタデータのみ保持（実際の画像パスは遅延生成）
const artworkMetadata = {
  'キュビズム': { count: 7, prefix: '/artworks/cubism/file_' },
  '印象派': { count: 7, prefix: '/artworks/impressionism/file_' },
  'シュルレアリスム': { count: 5, prefix: '/artworks/surrealism/file_' },
  '浮世絵': { count: 9, prefix: '/artworks/ukiyo-e/file_' }
};

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState(initialPlayersMinimal);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [hasReachedGoal, setHasReachedGoal] = useState(false);
  const [showGalleryHighlight, setShowGalleryHighlight] = useState(false);
  const [growthAnimation, setGrowthAnimation] = useState<{playerId: string, type: string} | null>(null);
  const [stepAnimation, setStepAnimation] = useState<number | null>(null);
  const [skipNextTurn, setSkipNextTurn] = useState<Record<string, boolean>>({});
  const [completedArtworks, setCompletedArtworks] = useState<Record<string, {playerId: string, playerName: string, playerColor: string, artStyle: string, imageUrl?: string}>>({});
  const [selectedArtwork, setSelectedArtwork] = useState<{playerId: string, playerName: string, playerColor: string, artStyle: string, imageUrl?: string} | null>(null);

  // メモ化された値
  const activePlayers = useMemo(() => 
    players.filter(p => p.position < 80), 
    [players]
  );

  const currentActivePlayer = useMemo(() => 
    activePlayers.length > 0 ? activePlayers[currentTurn % activePlayers.length] : null,
    [activePlayers, currentTurn]
  );

  const visibleSquares = useMemo(() => {
    const playerPositions = new Set(players.map(p => p.position));
    return mapSquares.filter(square => 
      square.number === 0 || // スタート
      square.number === 80 || // ゴール  
      playerPositions.has(square.number) || // プレイヤーがいる
      square.number === stepAnimation // アニメーション中
    );
  }, [players, stepAnimation]);

  // 遅延画像URL生成（必要時のみ）
  const getArtworkUrl = useCallback((artStyle: string): string => {
    const metadata = artworkMetadata[artStyle as keyof typeof artworkMetadata];
    if (!metadata) return '';
    
    const randomIndex = Math.floor(Math.random() * metadata.count);
    const fileNames: Record<string, string[]> = {
      'キュビズム': ['0000000000186230bdc3090b80e6800c.png', '0000000008ac62309ac662efd6aa8a7d.png', '00000000147061f8b3b0f0068b9cda1d.png', '000000004c5461f98d195fb22add2584.png', '000000005588622f96b2548c67594d01.png', '00000000692861f8876774da852526fd.png', '00000000e61861f7a71a4f56cb6193f4.png'],
      '印象派': ['0000000048f86230aa77bfd9b03a3445.png', '000000005e30622fb828606d7f5579d6.png', '000000005f1461f784f41ae83d249fdb.png', '0000000082f062308eeeec9136ac4ce3.png', '000000008a2861fdbeb3eac38c79694d.png', '000000009adc6230b012f16f0c909562.png', '00000000f65861f6967f985961f29e67.png'],
      'シュルレアリスム': ['00000000239461f5848ffc3c920d56be.png', '000000008480622faabbd7c403b69c11.png', '00000000caf4622f8f1c9f1a86849e53.png', '00000000d7b861f68e92ed95c0df522e.png', '00000000e11461f7a105613cecf7d6d1.png'],
      '浮世絵': ['00000000007c622fb1660a6debaa5daf.png', '000000000cb86230ba5d95719f00caa6.png', '00000000229861fd838f1b391a32ba43.png', '00000000647c61f881237cea86234e1c.png', '0000000069806230b9add556f1fa5dac.png', '000000007cf46230b62bbc7091bd9a95.png', '00000000919c61f68d43f0ae4ab973e8.png', '00000000ad646230989e9e187d8413e0.png', '00000000b334622f89c3c08be3441624.png']
    };
    
    const files = fileNames[artStyle] || [];
    return files.length > 0 ? `${metadata.prefix}${files[randomIndex]}` : '';
  }, []);

  const updatePlayerPosition = useCallback((playerId: string, newPosition: number) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === playerId ? { ...player, position: newPosition } : player
      )
    );
  }, []);

  const updatePlayerName = useCallback((playerId: string, newName: string) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === playerId ? { ...player, name: newName } : player
      )
    );
  }, []);

  const getArtStyleFromStatus = useCallback((status: {感性: number, 技術力: number, 創造力: number}): string => {
    const { 感性, 技術力, 創造力 } = status;
    const total = 感性 + 技術力 + 創造力;
    
    if (total === 0) {
      const styles = ['キュビズム', '印象派', 'シュルレアリスム', '浮世絵'];
      return styles[Math.floor(Math.random() * styles.length)];
    }
    
    const 感性割合 = 感性 / total;
    const 技術力割合 = 技術力 / total;
    const 創造力割合 = 創造力 / total;
    
    if (技術力割合 >= 0.5) return 'キュビズム';
    if (創造力割合 >= 0.5) return 'シュルレアリスム';
    if (感性割合 >= 0.4 && 技術力割合 >= 0.3) return '浮世絵';
    if (感性割合 >= 0.4) return '印象派';
    
    const maxValue = Math.max(感性, 技術力, 創造力);
    if (maxValue === 技術力) return 'キュビズム';
    if (maxValue === 創造力) return 'シュルレアリスム';
    if (maxValue === 感性) return '印象派';
    return '浮世絵';
  }, []);

  const startGame = useCallback((count: number = 2) => {
    setPlayerCount(count);
    setPlayers(initialPlayersMinimal.slice(0, count));
    setGameStarted(true);
    setCurrentTurn(0);
    setHasReachedGoal(false);
    setShowGalleryHighlight(false);
    setGrowthAnimation(null);
    setStepAnimation(null);
    setSkipNextTurn({});
    setCompletedArtworks({});
    setSelectedArtwork(null);
  }, []);

  const handleDiceRoll = useCallback(() => {
    if (activePlayers.length === 0) return;
    
    const currentActivePlayerIndex = currentTurn % activePlayers.length;
    const currentPlayer = activePlayers[currentActivePlayerIndex];
    const playerId = currentPlayer.id;
    
    if (skipNextTurn[playerId]) {
      setSkipNextTurn(prev => ({ ...prev, [playerId]: false }));
      setCurrentTurn(prev => (prev + 1) % activePlayers.length);
      return;
    }
    
    const roll = Math.floor(Math.random() * 6) + 1;
    let targetPosition = Math.min(currentPlayer.position + roll, 80);
    
    while (galleryIndices.includes(targetPosition) && targetPosition < 80) {
      targetPosition = targetPosition + 1;
    }
    
    updatePlayerPosition(playerId, targetPosition);
    
    const square = mapSquares.find(s => s.number === targetPosition);
    
    setStepAnimation(targetPosition);
    setTimeout(() => setStepAnimation(null), 600);
    
    if (square?.type === 'event' && square.growthType) {
      const growthType = square.growthType as '感性' | '技術力' | '創造力';
      setPlayers(prev => prev.map(player => 
        player.id === playerId 
          ? { ...player, status: { ...player.status, [growthType]: player.status[growthType] + 1 } }
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
        
        if (totalExperience >= minimumRequirement) {
          const artStyle = getArtStyleFromStatus(player.status);
          setCompletedArtworks(prev => ({
            ...prev,
            [playerId]: {
              playerId: player.id,
              playerName: player.name,
              playerColor: player.color,
              artStyle: artStyle
              // imageUrlは表示時に遅延生成
            }
          }));
          setShowGalleryHighlight(true);
        } else {
          setCompletedArtworks(prev => ({
            ...prev,
            [playerId]: {
              playerId: player.id,
              playerName: player.name,
              playerColor: player.color,
              artStyle: '習作'
            }
          }));
        }
        
        setHasReachedGoal(true);
      }
    }
    
    const finalActivePlayers = players.filter(p => p.position < 80 || (p.id === playerId && targetPosition === 80 ? false : true));
    if (finalActivePlayers.length > 0) {
      setCurrentTurn(prev => (prev + 1) % finalActivePlayers.length);
    }
  }, [activePlayers, currentTurn, skipNextTurn, players, completedArtworks, updatePlayerPosition, getArtStyleFromStatus]);

  const GameBoard = React.memo(() => {
    return (
      <div className="grid grid-cols-9 grid-rows-9 gap-2 md:gap-3 w-[380px] md:w-[450px] relative mx-auto place-items-center">
        {Array.from({ length: 81 }, (_, i) => {
          const square = mapSquares.find(s => s.number === i);
          if (!square) {
            return <div key={i} className="w-[40px] h-[40px] md:w-[46px] md:h-[46px] box-border" />;
          }
          
          // 必要な場合のみSquareを描画
          const hasPlayer = players.some(p => p.position === square.number);
          const isAnimated = stepAnimation === square.number;
          const isImportant = square.number === 0 || square.number === 80;
          
          if (!hasPlayer && !isAnimated && !isImportant) {
            return <div key={i} className="w-[40px] h-[40px] md:w-[46px] md:h-[46px] box-border opacity-30" />;
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
                {Object.values(completedArtworks).slice(0, 4).map((artwork) => (
                  <div key={artwork.playerId} className="relative group cursor-pointer p-1 hover:bg-amber-400/10 rounded transition-all" 
                       onClick={(e) => {
                         e.preventDefault();
                         e.stopPropagation();
                         // 遅延で画像URLを生成してセット
                         const artworkWithImage = {
                           ...artwork,
                           imageUrl: artwork.artStyle !== '習作' ? getArtworkUrl(artwork.artStyle) : undefined
                         };
                         setSelectedArtwork(artworkWithImage);
                       }}>
                    {artwork.artStyle === '習作' ? (
                      <div 
                        className="w-6 h-6 relative overflow-hidden border p-2 rounded bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-[8px] text-gray-300 shadow-sm hover:scale-105 transition-transform pointer-events-none"
                        title={`${artwork.playerName}: 習作（経験不足）`}
                      >
                        習
                      </div>
                    ) : (
                      <Suspense fallback={<div className="w-6 h-6 relative overflow-hidden border p-2 rounded bg-gray-800 animate-pulse"></div>}>
                        <LazyArtworkImage
                          src={getArtworkUrl(artwork.artStyle)}
                          alt={`${artwork.playerName}の${artwork.artStyle}作品`}
                          className="hover:scale-105 transition-transform pointer-events-none"
                          title={`${artwork.playerName}: ${artwork.artStyle}`}
                        />
                      </Suspense>
                    )}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${artwork.playerColor.replace('border-', 'bg-')} border border-white pointer-events-none`}></div>
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
  });

  const PlayerCountSelection = React.memo(() => (
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
            <span className="block text-xl md:text-3xl text-amber-200 font-light mt-3 italic whitespace-nowrap">メモリ最適版 v3.0</span>
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
  ));

  if (!gameStarted) {
    return <PlayerCountSelection />;
  }

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
            </div>

            {activePlayers.length > 0 && (
              <button
                onClick={handleDiceRoll}
                className="font-serif font-semibold px-8 py-3 rounded-full shadow-xl transform transition-all duration-300 border-2 bg-gradient-to-r from-black via-purple-900 to-black hover:from-purple-950 hover:to-purple-950 text-amber-100 border-amber-400 hover:border-amber-300 hover:shadow-amber-400/30 hover:scale-105"
              >
                <span className="tracking-wider">
                  ⚃ 運命のサイコロ
                </span>
              </button>
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
              {players.slice(0, playerCount).map((player) => (
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
                    {(['感性', '技術力', '創造力'] as const).map(statusType => (
                      <div key={statusType} className={`flex justify-between items-center text-sm transition-all duration-300 ${
                        growthAnimation?.playerId === player.id && growthAnimation.type === statusType 
                          ? 'animate-bounce text-amber-300 font-bold' : 'text-amber-200'
                      }`}>
                        <span className="font-serif font-light tracking-wide">{statusType}</span>
                        <span className="font-serif font-semibold">{player.status[statusType]}</span>
                      </div>
                    ))}
                    
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
                <div className="w-full max-w-[500px] h-[500px] mx-auto relative overflow-hidden border p-2 rounded-lg border-amber-400/20 shadow-xl bg-black/30 flex items-center justify-center">
                  <Suspense fallback={<div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center text-gray-400">読み込み中...</div>}>
                    <img
                      src={selectedArtwork.imageUrl}
                      alt={`${selectedArtwork.playerName}の${selectedArtwork.artStyle}作品`}
                      className="w-full h-full object-contain max-w-full max-h-full"
                      loading="lazy"
                    />
                  </Suspense>
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