export type SquareType = 'start' | 'normal' | 'event' | 'learn' | 'create' | 'blank' | 'gallery' | 'rest' | 'mystery' | 'branch' | 'styleA' | 'styleB' | 'goal' | 'silent';

export interface MapSquare {
  number: number;
  type: SquareType;
  isBranch?: boolean;
  name: string;
  growth?: '感性' | '技術力' | '創造力' | null;
  growthType?: '感性' | '技術力' | '創造力';
  options?: string[];
}

const squareTypes: SquareType[] = [
  "start", "learn", "event", "create", "blank", "gallery", "rest", "mystery", "normal", "event",
  "learn", "create", "blank", "gallery", "rest", "mystery", "normal", "event", "learn", "create",
  "blank", "gallery", "rest", "mystery", "normal", "event", "learn", "create", "blank", "gallery",
  "rest", "mystery", "normal", "event", "learn", "goal"
];

const CENTER_INDEX = 13;

export const galleryIndices = [30, 31, 32, 39, 40, 41, 48, 49, 50];

// ランダムに特殊マスを配置する関数
const generateRandomSpecialSquares = () => {
  const availablePositions = Array.from({ length: 81 }, (_, i) => i)
    .filter(i => i !== 0 && i !== 80 && !galleryIndices.includes(i)); // スタート、ゴール、ギャラリーを除外

  // 各ゾーンの範囲定義
  const zones = {
    cubism: availablePositions.filter(i => i >= 10 && i <= 20),
    impressionism: availablePositions.filter(i => i >= 25 && i <= 35),
    surrealism: availablePositions.filter(i => i >= 40 && i <= 50),
    ukiyoe: availablePositions.filter(i => i >= 55 && i <= 65)
  };

  // 各ゾーンから3つずつランダム選択
  const shuffleArray = (array: number[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const cubismSquares = shuffleArray(zones.cubism).slice(0, 2);
  const impressionismSquares = shuffleArray(zones.impressionism).slice(0, 2);
  const surrealismSquares = shuffleArray(zones.surrealism).slice(0, 2);
  const ukiyoeSquares = shuffleArray(zones.ukiyoe).slice(0, 2);

  // 休息マスをランダム配置（6つに増加）
  const usedPositions = [...cubismSquares, ...impressionismSquares, ...surrealismSquares, ...ukiyoeSquares];
  const remainingPositions = availablePositions.filter(i => !usedPositions.includes(i));
  const restSquares = shuffleArray(remainingPositions).slice(0, 6);

  return {
    cubism: cubismSquares,
    impressionism: impressionismSquares,
    surrealism: surrealismSquares,
    ukiyoe: ukiyoeSquares,
    rest: restSquares
  };
};

const specialSquares = generateRandomSpecialSquares();

export const mapSquares: MapSquare[] = Array.from({ length: 81 }, (_, i) => {
  if (galleryIndices.includes(i)) {
    return {
      number: i,
      type: 'gallery' as SquareType,
      name: '展示ギャラリー',
      growth: null,
    };
  } else if (i === 0) {
    return {
      number: i,
      type: 'start' as SquareType,
      name: '旅のはじまり',
      growth: null,
    };
  } else if (i === 80) {
    return {
      number: i,
      type: 'goal' as SquareType,
      name: '展示の刻',
      growth: null,
    };
  // キュビズムゾーン
  } else if (specialSquares.cubism.includes(i)) {
    return {
      number: i,
      type: 'event' as SquareType,
      name: 'キュビズムの実験',
      growthType: '技術力',
    };
  // 印象派ゾーン
  } else if (specialSquares.impressionism.includes(i)) {
    return {
      number: i,
      type: 'event' as SquareType,
      name: '光と色彩の発見',
      growthType: '感性',
    };
  // シュルレアリスムゾーン
  } else if (specialSquares.surrealism.includes(i)) {
    return {
      number: i,
      type: 'event' as SquareType,
      name: '夢の世界への扉',
      growthType: '創造力',
    };
  // 浮世絵ゾーン
  } else if (specialSquares.ukiyoe.includes(i)) {
    return {
      number: i,
      type: 'event' as SquareType,
      name: '日本の美の極致',
      growthType: '感性',
    };
  // 休息マス
  } else if (specialSquares.rest.includes(i)) {
    return {
      number: i,
      type: 'rest' as SquareType,
      name: '創作の休息',
    };
  } else {
    return {
      number: i,
      type: 'silent' as SquareType,
      name: `マス ${i}`,
      growth: null,
    };
  }
});