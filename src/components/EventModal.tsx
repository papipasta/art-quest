import React, { useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  showCopyButton?: boolean;
  onCopy?: () => void;
  showGenerateButton?: boolean;
  onGenerate?: () => void;
  isGenerating?: boolean;
  generatedImage?: string | null;
  onSaveArt?: (title: string, imageUrl: string) => void;
};

const EventModal = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  showCopyButton, 
  onCopy, 
  showGenerateButton, 
  onGenerate, 
  isGenerating, 
  generatedImage,
  onSaveArt
}: Props) => {
  const [artTitle, setArtTitle] = useState("");
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl text-center border-4 border-gray-800">
        <h2 className="text-xl font-bold mb-2 text-black">{title}</h2>
        <div className="transition-transform transform scale-100 hover:scale-105 duration-300 ease-in-out mb-4">
          <p className="text-sm italic text-gray-600 whitespace-pre-line">{description}</p>
        </div>
        
        {generatedImage && (
          <div className="mb-4">
            <img 
              src={generatedImage} 
              alt="Generated Art" 
              className="mx-auto rounded-lg shadow-lg max-w-sm animate-art-reveal"
            />
            <div className="mt-6 flex flex-col items-center gap-4">
              <input
                type="text"
                placeholder="作品にタイトルを..."
                value={artTitle}
                onChange={(e) => setArtTitle(e.target.value)}
                className="px-4 py-2 rounded border border-gray-300 shadow-sm text-center"
              />
              <button
                onClick={() => {
                  if (onSaveArt && generatedImage) {
                    onSaveArt(artTitle, generatedImage);
                    setSaved(true);
                  }
                }}
                className="bg-indigo-600 text-white px-5 py-2 rounded shadow-lg hover:bg-indigo-700"
              >
                保存する
              </button>
              {saved && (
                <p className="text-green-500 italic animate-fade-in">保存しました。創造の軌跡が刻まれました。</p>
              )}
            </div>
          </div>
        )}
        
        <div className="flex gap-2 justify-center flex-wrap">
          {showCopyButton && onCopy && (
            <button
              onClick={onCopy}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              📋 プロンプトをコピー
            </button>
          )}
          {showGenerateButton && onGenerate && (
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {isGenerating ? '🎨 生成中...' : '🎨 アートを生成'}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;