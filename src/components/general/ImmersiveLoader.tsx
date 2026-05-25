import React from 'react';

export const ImmersiveLoader: React.FC = () => {
  return (
    <div id="immersive-loader" className="fixed inset-0 bg-gray-950 z-70 flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Glowing golden spinner */}
        <div className="h-16 w-16 rounded-full border-4 border-orange-500/10 border-t-orange-600 animate-spin"></div>
        <div className="absolute text-orange-500 text-xl font-bold font-sans">🦁</div>
      </div>
      <p className="mt-6 text-sm text-gray-400 font-mono tracking-widest uppercase animate-pulse">
        Menu Africa...
      </p>
    </div>
  );
};
