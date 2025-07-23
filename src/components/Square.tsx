export default function Square({ square, players, stepAnimation }: {
  square: any;
  players?: any[];
  stepAnimation?: number | null;
}) {
  // マスタイプと位置に基づくスタイル定義
  const getSquareStyle = (type: string, number: number) => {
    // 芸術テーマゾーンの判定
    const getThemeStyle = (num: number) => {
      if (num >= 10 && num <= 20) {
        // キュビズムゾーン
        return {
          bg: 'bg-gradient-to-br from-slate-900/30 to-slate-800/40 border-slate-400/30',
          theme: '◆', // 幾何学的
          themeColor: 'text-slate-300/70'
        };
      } else if (num >= 25 && num <= 35) {
        // 印象派ゾーン
        return {
          bg: 'bg-gradient-to-br from-amber-900/30 to-amber-800/40 border-amber-400/30',
          theme: '☀', // 光
          themeColor: 'text-amber-300/70'
        };
      } else if (num >= 40 && num <= 50) {
        // シュルレアリスムゾーン
        return {
          bg: 'bg-gradient-to-br from-purple-900/30 to-purple-800/40 border-purple-400/30',
          theme: '◇', // 夢的
          themeColor: 'text-purple-300/70'
        };
      } else if (num >= 55 && num <= 65) {
        // 浮世絵ゾーン
        return {
          bg: 'bg-gradient-to-br from-emerald-900/30 to-emerald-800/40 border-emerald-400/30',
          theme: '◈', // 和風
          themeColor: 'text-emerald-300/70'
        };
      }
      return null;
    };

    const themeStyle = getThemeStyle(number);
    
    switch (type) {
      case 'start':
        return {
          bg: 'bg-gradient-to-br from-emerald-900/50 to-emerald-800/60 border-emerald-400/50',
          icon: '▶',
          glow: 'shadow-emerald-400/30',
          theme: null,
          iconColor: 'text-emerald-300'
        };
      case 'goal':
        return {
          bg: 'bg-gradient-to-br from-amber-900/50 to-amber-800/60 border-amber-400/50',
          icon: '✦',
          glow: 'shadow-amber-400/30',
          theme: null,
          iconColor: 'text-amber-200'
        };
      case 'event':
        return {
          bg: themeStyle?.bg || 'bg-gradient-to-br from-purple-900/30 to-purple-800/40 border-purple-400/30',
          icon: '※',
          glow: 'shadow-purple-400/20',
          theme: themeStyle?.theme,
          themeColor: themeStyle?.themeColor,
          iconColor: themeStyle?.themeColor || 'text-purple-300/70'
        };
      case 'rest':
        return {
          bg: 'bg-gradient-to-br from-indigo-900/30 to-indigo-800/40 border-indigo-400/30',
          icon: '◎',
          glow: 'shadow-indigo-400/20',
          theme: null,
          iconColor: 'text-indigo-300/70'
        };
      default:
        return {
          bg: themeStyle?.bg || 'bg-gradient-to-br from-gray-900/20 to-gray-800/30 border-gray-400/20',
          icon: '',
          glow: 'shadow-gray-400/10',
          theme: themeStyle?.theme,
          themeColor: themeStyle?.themeColor,
          iconColor: 'text-gray-400/50'
        };
    }
  };

  const style = getSquareStyle(square.type, square.number);
  const isAnimated = stepAnimation === square.number;

  return (
    <div className={`relative w-[40px] h-[40px] md:w-[46px] md:h-[46px] ${style.bg} border rounded-sm backdrop-blur-sm transition-all duration-200 box-border ${
      isAnimated ? 'animate-bounce scale-110 shadow-lg shadow-amber-400/40 border-amber-400/60' : style.glow
    } hover:border-amber-400/40 hover:shadow-md`}>
      <div className="absolute top-0.5 left-0.5 text-[7px] text-amber-200/60 font-serif z-10 font-light">
        {square.number}
      </div>

      {/* テーマアイコン（右上） */}
      {style.theme && (
        <div className={`absolute top-0.5 right-0.5 text-[8px] ${style.themeColor} font-light`}>
          {style.theme}
        </div>
      )}

      {/* マスタイプ別のアイコン */}
      {style.icon && (
        <div className={`absolute bottom-0.5 right-0.5 text-[10px] transition-all duration-300 ${
          isAnimated ? 'text-amber-300 animate-pulse' : style.iconColor || 'text-amber-300/60'
        } font-light`}>
          {style.icon}
        </div>
      )}

      {/* プレイヤー表示 - 安定化 */}
      {players && Array.isArray(players) && players.length > 0 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          {(() => {
            // そのマスにいるプレイヤーのみをフィルタリング（安定化処理）
            const playersOnThisSquare = players.filter((p: any) => {
              if (!p || typeof p !== 'object') return false;
              if (typeof p.position !== 'number') return false;
              return p.position === square.number;
            });
            
            if (playersOnThisSquare.length === 0) return null;
            
            return playersOnThisSquare.map((p: any, index: number) => {
              // 複数プレイヤーがいる場合の位置調整
              const positions = [
                { x: '50%', y: '20%', transform: 'translate(-50%, -50%)' }, // 上
                { x: '80%', y: '50%', transform: 'translate(-50%, -50%)' }, // 右
                { x: '50%', y: '80%', transform: 'translate(-50%, -50%)' }, // 下
                { x: '20%', y: '50%', transform: 'translate(-50%, -50%)' }  // 左
              ];
              
              const position = playersOnThisSquare.length === 1 
                ? { x: '50%', y: '50%', transform: 'translate(-50%, -50%)' }
                : positions[index] || positions[0];
              
              return (
                <div 
                  key={`player-${p.id || index}-square-${square.number}`} 
                  className="absolute"
                  style={{
                    left: position.x,
                    top: position.y,
                    transform: position.transform,
                    zIndex: 30 + index
                  }}
                >
                  <div 
                    className={`w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 border-2 ${p.color} shadow-lg flex items-center justify-center text-[10px] md:text-[11px] font-bold text-black hover:scale-110 transition-transform duration-200 z-40`} 
                    title={p.name}
                  >
                    {p.name && typeof p.name === 'string' && p.name.length > 0 ? p.name[0] : '?'}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}

      {/* 踏んだ時の詩的な演出 */}
      {isAnimated && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-xs text-cyan-400 font-serif italic animate-fade-in-out">
            {square.type === 'event' && '✨'}
            {square.type === 'rest' && '💫'}
          </div>
        </div>
      )}
    </div>
  );
}