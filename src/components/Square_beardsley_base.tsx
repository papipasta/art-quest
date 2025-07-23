export default function Square({ square, players }: {
  square: any;
  players?: any;
}) {
  return (
    <div className="relative w-[44px] h-[44px] bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300/60 rounded shadow-md hover:shadow-lg transition-all duration-200">
      <div className="absolute top-1 left-1 text-[8px] text-amber-700/70 font-serif z-10">
        {square.number}
      </div>

      {/* イベントマスのアイコン */}
      {square.type === 'event' && (
        <div className="absolute bottom-1 right-1 text-[12px] text-amber-600">✦</div>
      )}

      {/* プレイヤー表示 */}
      {players?.map((p: any) => (
        p.position === square.number && (
          <div key={p.id} className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 border-2 border-amber-600 shadow-lg z-30 flex items-center justify-center text-sm font-bold text-amber-900" title={p.name}>
              {p.name[0]}
            </div>
          </div>
        )
      ))}
    </div>
  );
}