import { useState } from "react";

export const DiceRoll = ({ onRolled }: { onRolled: () => void }) => {
  const [rolling, setRolling] = useState(false);
  const [diceNumber, setDiceNumber] = useState<number | null>(null);

  const rollDice = () => Math.floor(Math.random() * 6) + 1;
  const fallbackDiceImage = "/icons/dice_faces/dice_1.svg";

  const handleRoll = () => {
    setRolling(true);
    setDiceNumber(null);

    const result = rollDice();
    setTimeout(() => {
      setDiceNumber(result);
      setRolling(false);
      onRolled(); // App.tsxのrollDice関数を呼び出す
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center space-y-4 min-h-[120px]">
      <button
        onClick={handleRoll}
        className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition-transform"
      >
        サイコロを振る
      </button>

      {rolling && (
        <div className="text-6xl animate-dice-in-place">🎲</div>
      )}

      {diceNumber !== null && !rolling && (
        <div className="flex flex-col items-center animate-dice-result">
          <div className="text-5xl">
            {['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][diceNumber - 1]}
          </div>
          <span className="text-sm text-gray-600 mt-1">出目: {diceNumber}</span>
        </div>
      )}
    </div>
  );
};