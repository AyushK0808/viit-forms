const ProgressBar: React.FC<{ currentPage: number; totalPages: number }> = ({ currentPage, totalPages }) => {
  const progress = (currentPage / totalPages) * 100;

  return (
    <div className="w-full bg-purple-900/30 rounded-full h-2 mb-8 overflow-hidden">
      <div
        className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-purple-300 opacity-50 animate-pulse"></div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-purple-300">
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;