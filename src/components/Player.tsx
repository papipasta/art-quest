import React from 'react';
import { DiceRoll } from './DiceRoll';

interface PlayerProps {
  position: number;
  movePlayer: (steps: number) => void;
  rollDice: () => void;
}

const Player = ({ position, rollDice }: PlayerProps) => {
  return (
    <div className="mt-4">
      <DiceRoll onRolled={rollDice} />
      <p className="mt-2 text-gray-700">現在地: {position} マス目</p>
    </div>
  );
};

export default Player;