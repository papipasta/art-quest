import React from 'react';

interface Props {
  open: boolean;
  options: string[];
  onChoose: (option: string) => void;
}

const BranchModal = ({ open, options, onChoose }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white px-6 py-4 rounded shadow-lg text-center font-serif space-y-2">
        <p className="text-lg">あなたはどの筆跡を選びますか？</p>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChoose(opt)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded text-sm"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BranchModal;