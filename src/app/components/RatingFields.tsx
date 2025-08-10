const RatingField: React.FC<{
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  required?: boolean;
}> = ({ id, label, value, onChange, required = false }) => {
  return (
    <div className="mb-4 transform transition-all duration-300 hover:translate-x-1 group">
      <label className="block text-purple-300 text-sm font-bold mb-2" htmlFor={id}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="flex items-center space-x-2">
        <span className="text-purple-300 text-sm">1</span>
        <input
          id={id}
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          required={required}
          className="flex-1 appearance-none bg-purple-900 h-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <span className="text-purple-300 text-sm">10</span>
        <div className="w-8 text-center">
          <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm font-bold">{value}</span>
        </div>
      </div>
    </div>
  );
};

export default RatingField;