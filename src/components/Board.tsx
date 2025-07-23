import React, { useState, useEffect } from 'react';
import Square from './Square';
import { mapSquares, SquareType } from '../mapData';
import EventModal from './EventModal';
import PencilAnimation from './PencilAnimation';
import BranchModal from './BranchModal';

interface BoardProps {
  players?: Array<{ id: number; name: string; position: number; }>;
  squares?: Array<{ number: number; type: SquareType; name: string; }>;
}

const poeticMessages: Record<SquareType, string[]> = {
  start: ['創造の旅が始まる...'],
  normal: ['歩みを進める...'],
  event: [
    "あなたの前に、風に舞う筆触が現れた——それは感性の予兆。",
    "一枚の紙が宙に浮き、未知の構図が頭に宿る。",
  ],
  learn: [
    "遠くから浮世絵師の声が聞こえる...『筆は心の軌跡なり』",
    "西洋の画布に触れ、幾何学が語りかける。",
  ],
  create: [
    "心にたまった色彩が、いま形を欲している——創造のときだ。",
    "あなたの中の芸術が、ついにその輪郭を見せ始めた。",
    "激しい筆の跳ね——創造が爆ぜる。",
  ],
  blank: ['静かなる一歩。墨を落とすように進む。'],
  gallery: ['あなたの作品が壁にかけられる──共鳴が生まれている。'],
  rest: ['筆を置く。心が静かに水面に広がる。'],
  mystery: ['霧の向こうに、未知なる構図が囁いている…'],
  branch: ['2つの芸術の道が交わる分岐点…'],
  styleA: ['浮世絵の風が頬を撫でていく…'],
  styleB: ['立方体が踊る──現実は幾何学に解体される…'],
  goal: ['芸術の旅路が完成した！'],
  silent: ['静寂が筆を包み込む…'],
};

const poeticStatusMessages: Record<string, string> = {
  感性: "あなたの感性は、春の風に触れるように研ぎ澄まされた。",
  創造力: "創造の泉が静かに波打ち、内なる色彩が目を覚ます。",
  技術力: "手のひらから、確かな線が世界に刻まれるようになった。",
};

const backgroundStyles: Record<string, string> = {
  感性: "url('/images/bg_spring_brush.png')",
  創造力: "url('/images/bg_color_wave.png')",
  技術力: "url('/images/bg_grid_art.png')",
};

const statusIcons: Record<string, string> = {
  感性: "/icons/ukiyo_wave.svg",
  創造力: "/icons/color_splash.svg",
  技術力: "/icons/grid_compass.svg",
};

type StatusChange = { type: string; amount: number };

const Board = ({ players = [], squares = mapSquares }: BoardProps) => {
  const [modalData, setModalData] = useState({ 
    open: false, 
    title: '', 
    description: '', 
    showCopyButton: false, 
    onCopy: undefined as (() => void) | undefined,
    showGenerateButton: false,
    onGenerate: undefined as (() => void) | undefined
  });
  const [statusEffect, setStatusEffect] = useState<{message: string, status: string} | null>(null);
  const [currentBackground, setCurrentBackground] = useState<string | null>(null);
  const [currentSoundType, setCurrentSoundType] = useState<SquareType | null>(null);
  const [animationType, setAnimationType] = useState<string | null>(null);
  const [showStatusIcon, setShowStatusIcon] = useState<string | null>(null);
  const [playerStats, setPlayerStats] = useState({ 感性: 0, 創造力: 0, 技術力: 0 });
  const [showFinalStats, setShowFinalStats] = useState(false);
  const [victoryArt, setVictoryArt] = useState<string | null>(null);
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  const [savedArtworks, setSavedArtworks] = useState<{title: string, image: string, date: string}[]>([]);
  const [branchOpen, setBranchOpen] = useState(false);
  const [route, setRoute] = useState<'A' | 'B' | null>(null);

  // 初期化時にlocalStorageから作品を読み込み
  useEffect(() => {
    const storedArtworks = JSON.parse(localStorage.getItem("savedArtworks") || "[]");
    setSavedArtworks(storedArtworks);
  }, []);

  const generateArtPrompt = (finalStats: {感性: number, 創造力: number, 技術力: number}) => {
    const prompt = `a symbolic painting representing ${finalStats.感性} levels of sensitivity, ${finalStats.創造力} units of creativity and ${finalStats.技術力} of technical mastery, surrealist style with soft brushwork, pastel tones, one-of-a-kind art --v 5 --ar 1:1`;
    return prompt;
  };

  const generateUniqueArt = async (prompt: string) => {
    try {
      const response = await fetch("/api/generate-art", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Art generation failed:', error);
      return null;
    }
  };

  const handleVictory = async (prompt: string) => {
    setIsGeneratingArt(true);
    try {
      const imageUrl = await generateUniqueArt(prompt);
      setVictoryArt(imageUrl);
    } catch (error) {
      console.error('Failed to generate victory art:', error);
    } finally {
      setIsGeneratingArt(false);
    }
  };

  const saveArtwork = (title: string, imageUrl: string) => {
    const artwork = {
      title: title || "無題の作品",
      image: imageUrl,
      date: new Date().toISOString(),
    };
    
    // 既存の作品を取得
    const existingArtworks = JSON.parse(localStorage.getItem("savedArtworks") || "[]");
    const updatedArtworks = [...existingArtworks, artwork];
    
    // localStorageに複数の作品を保存
    localStorage.setItem("savedArtworks", JSON.stringify(updatedArtworks));
    localStorage.setItem("savedArtwork", JSON.stringify(artwork)); // 最新作品も個別保存
    
    setSavedArtworks(updatedArtworks);
    console.log('Artwork saved:', artwork);
  };

  const copyPromptToClipboard = (prompt: string) => {
    navigator.clipboard.writeText(prompt).then(() => {
      alert('プロンプトをクリップボードにコピーしました！');
    }).catch(() => {
      alert('コピーに失敗しました。手動でコピーしてください。');
    });
  };

  const showFinalStatsModal = () => {
    const finalStats = {
      感性: playerStats.感性,
      創造力: playerStats.創造力,
      技術力: playerStats.技術力,
    };
    
    const statsText = Object.entries(finalStats)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    const artPrompt = generateArtPrompt(finalStats);
    
    setModalData({
      open: true,
      title: '🎨 アーティストとしての成長',
      description: `あなたの創造の旅路が完了しました。\n\n${statsText}\n\n芸術の道はここから始まります...\n\n【AI画像生成プロンプト】\n${artPrompt}`,
      showCopyButton: true,
      onCopy: () => copyPromptToClipboard(artPrompt),
      showGenerateButton: true,
      onGenerate: () => handleVictory(artPrompt)
    });
  };

  const displayStatusIcon = (status: string) => {
    setShowStatusIcon(statusIcons[status]);
    setTimeout(() => setShowStatusIcon(null), 1800);
  };

  const playPencilSound = () => {
    const audio = new Audio("/sounds/pencil_sketch.mp3");
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const playSoundForType = (type: SquareType) => {
    const sounds: Record<SquareType, string> = {
      start: "/sounds/start.mp3",
      normal: "/sounds/step.mp3",
      event: "/sounds/wind_chime.mp3",
      learn: "/sounds/brush_stroke.mp3",
      create: "/sounds/pencil_sketch.mp3",
      blank: "/sounds/step.mp3",
      gallery: "/sounds/applause.mp3",
      rest: "/sounds/water_drops.mp3",
      mystery: "/sounds/mystery.mp3",
      branch: "/sounds/crossroads.mp3",
      styleA: "/sounds/japanese_flute.mp3",
      styleB: "/sounds/modern_jazz.mp3",
      goal: "/sounds/victory.mp3",
      silent: "/sounds/silence.mp3",
    };
    const soundUrl = sounds[type];
    if (soundUrl) {
      const audio = new Audio(soundUrl);
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const playSpecialSound = (type: SquareType) => {
    const sounds: Record<SquareType, string> = {
      start: "/sounds/start.mp3",
      normal: "/sounds/step.mp3",
      event: "/sounds/wind_chime.mp3",
      learn: "/sounds/brush_stroke.mp3",
      create: "/sounds/pencil_sketch.mp3",
      blank: "/sounds/step.mp3",
      gallery: "/sounds/soft_applause.mp3",
      rest: "/sounds/gentle_stream.mp3",
      mystery: "/sounds/mystic_wind.mp3",
      branch: "/sounds/crossroads.mp3",
      styleA: "/sounds/japanese_flute.mp3",
      styleB: "/sounds/modern_jazz.mp3",
      goal: "/sounds/victory.mp3",
      silent: "/sounds/silence.mp3",
    };
    const soundUrl = sounds[type];
    if (soundUrl) {
      const audio = new Audio(soundUrl);
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  // モーダル表示時に呼び出し
  useEffect(() => {
    if (currentSoundType) {
      playSoundForType(currentSoundType);
    }
  }, [currentSoundType]);

  // イベント発生時に更新
  const updateBackgroundByStatus = (status: string) => {
    const bg = backgroundStyles[status];
    setCurrentBackground(bg);
  };

  const handleEventEffect = (status: string, amount: number) => {
    const poeticMessage = poeticStatusMessages[status];
    const fullMessage = `${status} +${amount}：${poeticMessage}`;
    setStatusEffect({message: fullMessage, status});
    updateBackgroundByStatus(status);
    displayStatusIcon(status);
    
    // ステータスを更新
    setPlayerStats(prev => ({
      ...prev,
      [status]: prev[status as keyof typeof prev] + amount
    }));
    
    setTimeout(() => setStatusEffect(null), 2500);
  };

  const handleMultipleStatusEffects = (changes: StatusChange[]) => {
    changes.forEach(({ type, amount }, index) => {
      const poeticMessage = poeticStatusMessages[type];
      const fullMessage = `${type} +${amount}：${poeticMessage}`;
      setTimeout(() => {
        setStatusEffect({message: fullMessage, status: type});
        updateBackgroundByStatus(type);
        displayStatusIcon(type);
        setTimeout(() => setStatusEffect(null), 2500);
      }, index * 2500); // 順番に表示されるように
    });
  };

  const displayModal = (event: SquareType) => {
    const message = poeticMessages[event]?.[
      Math.floor(Math.random() * poeticMessages[event].length)
    ] || "静かな時が流れる…";
    
    let title = '';
    switch (event) {
      case 'event':
        title = `🎭 芸術イベント`;
        break;
      case 'learn':
        title = `📘 スタイル学習`;
        break;
      case 'create':
        title = `🎨 創作の瞬間`;
        break;
      default:
        title = `✨ 神秘の瞬間`;
    }
    
    setModalData({ 
      open: true, 
      title, 
      description: message, 
      showCopyButton: false, 
      onCopy: undefined,
      showGenerateButton: false,
      onGenerate: undefined
    });
  };

  const runPoeticEventSequence = (
    squareType: SquareType,
    statusChanges: StatusChange[]
  ) => {
    // モーダルと音
    displayModal(squareType);
    playSoundForType(squareType);
    if (squareType === "create") {
      playPencilSound();
      setAnimationType('create');
    }

    // 背景変更
    statusChanges.forEach(({ type }) => {
      updateBackgroundByStatus(type);
    });

    // ステータス演出とアイコン表示（時差で出現）
    statusChanges.forEach(({ type, amount }, index) => {
      setTimeout(() => {
        handleEventEffect(type, amount);
        displayStatusIcon(type);
      }, index * 2500);
    });
  };

  const handleSquareClick = (type: string, number: number) => {
    let title = '';
    let description = '';

    if (type === 'branch') {
      setBranchOpen(true);
      return;
    }

    if (type === 'styleA' || type === 'styleB') {
      if (route === 'A') {
        title = '🖌️ 浮世絵スタイル';
        description = '筆の流れがあなたの心に語りかける。和の美が芽生えました。';
      } else if (route === 'B') {
        title = '🧊 キュビズムスタイル';
        description = '幾何学の断片が視界を支配する。抽象の美が開花しました。';
      } else {
        title = '🎨 未選択スタイル';
        description = 'まだ芸術の道を選んでいません。分岐マスへ戻りましょう。';
      }

      setModalData({ 
        open: true, 
        title, 
        description, 
        showCopyButton: false, 
        onCopy: undefined,
        showGenerateButton: false,
        onGenerate: undefined
      });
      return;
    }

    // 通常イベント処理
    switch (type) {
      case 'event':
        runPoeticEventSequence('event', [
          { type: "感性", amount: 1 },
          { type: "創造力", amount: 2 },
        ]);
        break;
      case 'learn':
        runPoeticEventSequence('learn', [
          { type: "技術力", amount: 1 },
        ]);
        break;
      case 'create':
        runPoeticEventSequence('create', [
          { type: "創造力", amount: 2 },
          { type: "感性", amount: 1 },
        ]);
        break;
      default:
        return;
    }
  };

  const handleBranchChoice = (chosenRoute: 'A' | 'B') => {
    setRoute(chosenRoute);
    setBranchOpen(false);
    // 進行方向を変える処理（例：マスのフィルタリングなど）
    console.log(`Player chose route ${chosenRoute}`);
  };

  const generatePrompt = () => {
    if (route === 'A') {
      return 'Japanese ukiyo-e style, monochrome ink, traditional motifs, woodblock texture';
    } else if (route === 'B') {
      return 'Cubist painting, geometric abstraction, Picasso-inspired, bold shapes';
    }
    return 'Abstract art, undefined style';
  };

  return (
    <div
      className="w-full h-full transition-all duration-1000 ease-in-out"
      style={{
        backgroundImage: currentBackground || "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="grid grid-cols-6 gap-5 p-6 bg-slate-50 ring-1 ring-gray-200 rounded-xl shadow-inner">
        {squares.map((square, index) => {
          const playersHere = players.filter((p) => p.position === index);
          return (
            <Square
              key={index}
              square={square}
              players={playersHere}
            />
          );
        })}
      </div>
      {statusEffect && (
        <div 
          className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200 bg-cover bg-center"
          style={{ backgroundImage: backgroundStyles[statusEffect.status] }}
        >
          <div className="flex items-center gap-2 bg-white bg-opacity-80 p-2 rounded">
            <img 
              src={statusIcons[statusEffect.status]} 
              alt={statusEffect.status}
              className="w-6 h-6"
            />
            <p className="text-sm text-purple-800 font-medium">{statusEffect.message}</p>
          </div>
        </div>
      )}
      <div className="mt-4">
        <PencilAnimation type={animationType || undefined} />
      </div>
      <div className="mt-4 p-3 bg-white bg-opacity-90 rounded-lg border border-gray-300">
        <h3 className="text-lg font-bold mb-2">現在のステータス</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <img src="/icons/ukiyo_wave.svg" alt="感性" className="w-4 h-4" />
            <span>感性: {playerStats.感性}</span>
          </div>
          <div className="flex items-center gap-1">
            <img src="/icons/color_splash.svg" alt="創造力" className="w-4 h-4" />
            <span>創造力: {playerStats.創造力}</span>
          </div>
          <div className="flex items-center gap-1">
            <img src="/icons/grid_compass.svg" alt="技術力" className="w-4 h-4" />
            <span>技術力: {playerStats.技術力}</span>
          </div>
        </div>
        <button 
          onClick={showFinalStatsModal}
          className="mt-2 px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
        >
          最終結果を表示
        </button>
      </div>
      {showStatusIcon && (
        <div className="absolute top-6 right-6 opacity-90 animate-fade-in">
          <img src={showStatusIcon} alt="Status Icon" className="w-10 h-10" />
        </div>
      )}
      <EventModal
        isOpen={modalData.open}
        onClose={() => setModalData({ 
          open: false, 
          title: '', 
          description: '', 
          showCopyButton: false, 
          onCopy: undefined,
          showGenerateButton: false,
          onGenerate: undefined
        })}
        title={modalData.title}
        description={modalData.description}
        showCopyButton={modalData.showCopyButton}
        onCopy={modalData.onCopy}
        showGenerateButton={modalData.showGenerateButton}
        onGenerate={modalData.onGenerate}
        isGenerating={isGeneratingArt}
        generatedImage={victoryArt}
        onSaveArt={saveArtwork}
      />
    </div>
  );
};

export default Board;