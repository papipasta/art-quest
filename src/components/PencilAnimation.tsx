import React, { useState, useEffect } from 'react';

interface PencilAnimationProps {
  type?: string;
}

const PencilAnimation = ({ type }: PencilAnimationProps) => {
  const [showPencilAnimation, setShowPencilAnimation] = useState(false);

  useEffect(() => {
    if (type === "create") {
      // アニメーションをトリガー
      setShowPencilAnimation(true);
      setTimeout(() => setShowPencilAnimation(false), 2000);
    }
  }, [type]);

  return (
    <div>
      {showPencilAnimation && (
        <div className="relative w-full h-2">
          <div className="pencil-draw"></div>
        </div>
      )}
    </div>
  );
};

export default PencilAnimation;