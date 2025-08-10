const InputField: React.FC<{
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
  options?: string[];
}> = ({ id, label, type = 'text', value, onChange, required = false, placeholder, error, options }) => {
  const baseClasses = "shadow appearance-none border bg-black bg-opacity-60 backdrop-blur-sm rounded-lg w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300";
  const errorClasses = error ? "border-red-500" : "border-purple-500/30";

  if (type === 'select' && options) {
    return (
      <div className="mb-4 transform transition-all duration-300 hover:translate-x-1 group">
        <label className="block text-purple-300 text-sm font-bold mb-2" htmlFor={id}>
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <div className="relative">
          <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className={`${baseClasses} ${errorClasses}`}
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <div className="absolute inset-0 border border-purple-500/0 rounded-lg group-hover:border-purple-500/30 transition-all duration-300 pointer-events-none"></div>
        </div>
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="mb-4 transform transition-all duration-300 hover:translate-x-1 group">
        <label className="block text-purple-300 text-sm font-bold mb-2" htmlFor={id}>
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <div className="relative">
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            placeholder={placeholder}
            rows={4}
            className={`${baseClasses} ${errorClasses} resize-none`}
          />
          <div className="absolute inset-0 border border-purple-500/0 rounded-lg group-hover:border-purple-500/30 transition-all duration-300 pointer-events-none"></div>
        </div>
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mb-4 transform transition-all duration-300 hover:translate-x-1 group">
      <label className="block text-purple-300 text-sm font-bold mb-2" htmlFor={id}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className={`${baseClasses} ${errorClasses}`}
        />
        <div className="absolute inset-0 border border-purple-500/0 rounded-lg group-hover:border-purple-500/30 transition-all duration-300 pointer-events-none"></div>
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputField;