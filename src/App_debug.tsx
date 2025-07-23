import React, { useState } from 'react';

const initialPlayers = [
  {
    id: 'player1',
    name: '蔦屋軽三郎',
    color: 'border-indigo-500',
    position: 0,
    status: { 感性: 0, 技術力: 0, 創造力: 0 }
  },
  {
    id: 'player2',
    name: 'ピカーソ',
    color: 'border-pink-500',
    position: 0,
    status: { 感性: 0, 技術力: 0, 創造力: 0 }
  }
];

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState(initialPlayers);

  const startGame = (count: number = 2) => {
    const gamePlayers = initialPlayers.slice(0, count);
    setPlayers(gamePlayers);
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-slate-900 p-8 flex items-center justify-center">
        <div className="bg-black/60 border border-amber-400/30 rounded-lg p-8 backdrop-blur-sm shadow-2xl max-w-md mx-auto">
          <h1 className="text-2xl font-serif text-amber-200 mb-8 text-center">ART QUEST - Debug Version</h1>
          <h2 className="text-xl font-serif text-amber-200 mb-8 tracking-wide">プレイヤー人数選択</h2>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[2, 3].map(count => (
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
          
          <button
            onClick={() => startGame(playerCount)}
            className="w-full bg-gradient-to-r from-emerald-900 to-emerald-800 text-amber-100 font-serif font-semibold py-3 px-6 rounded-lg shadow-xl transition-all duration-300 border-2 border-amber-400"
          >
            ゲーム開始
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-slate-900 p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif text-amber-100 mb-4">ART QUEST - ゲーム画面</h1>
        <p className="text-amber-200">デバッグバージョンが正常に動作しています</p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          {players.map((player, index) => (
            <div key={player.id} className="bg-black/60 border border-amber-400/20 rounded-lg p-4">
              <h3 className="text-amber-100 font-serif text-lg">{player.name}</h3>
              <p className="text-amber-200">位置: {player.position}</p>
              <p className="text-amber-200">感性: {player.status.感性}</p>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => setGameStarted(false)}
          className="mt-8 bg-gray-700 hover:bg-gray-600 text-amber-200 font-serif py-2 px-6 rounded-lg transition-all duration-300"
        >
          設定に戻る
        </button>
      </div>
    </div>
  );
};

export default App;