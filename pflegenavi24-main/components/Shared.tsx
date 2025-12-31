import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'sunny';
  fullWidth?: boolean;
  size?: 'normal' | 'large';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  size = 'normal',
  className = '', 
  ...props 
}) => {
  // Increased padding and font weight for accessibility
  const baseClasses = "rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:ring-4 focus:ring-offset-2";
  
  const sizeClasses = size === 'large' ? "py-4 px-8 text-xl" : "py-3 px-6 text-lg";

  const variants = {
    primary: "bg-lilac-600 text-white hover:bg-lilac-700 focus:ring-lilac-400",
    secondary: "bg-white text-lilac-900 border-2 border-lilac-200 hover:bg-lilac-50 focus:ring-lilac-300",
    outline: "border-2 border-lilac-600 text-lilac-700 hover:bg-lilac-50 focus:ring-lilac-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-300",
    sunny: "bg-sunny-300 text-sunny-900 hover:bg-sunny-400 focus:ring-sunny-200 border-2 border-sunny-400"
  };

  return (
    <button 
      className={`${baseClasses} ${sizeClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; highlight?: boolean }> = ({ children, className = '', highlight = false }) => (
  <div className={`rounded-2xl shadow-lg p-8 border-2 ${highlight ? 'bg-sunny-50 border-sunny-200' : 'bg-white border-lilac-100'} ${className}`}>
    {children}
  </div>
);

export const Checkbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  className?: string;
}> = ({ label, checked, onChange, required, className = '' }) => (
  <label className={`flex items-start space-x-4 cursor-pointer p-4 rounded-xl border-2 hover:bg-lilac-50 transition-colors ${checked ? 'border-lilac-500 bg-lilac-50' : 'border-transparent'} ${className}`}>
    <div className="flex items-center h-8">
      <input
        type="checkbox"
        className="w-8 h-8 text-lilac-600 border-gray-300 rounded focus:ring-lilac-500"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
    <div className="text-lg text-gray-800 leading-relaxed font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </div>
  </label>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, className = '', ...props }) => (
  <div className={`mb-6 ${className}`}>
    <label className="block text-lg font-bold text-gray-800 mb-2">{label}</label>
    <input
      className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-lilac-200 focus:border-lilac-500 transition-shadow bg-white"
      {...props}
    />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: {value: string; label: string}[] }> = ({ label, options, className = '', ...props }) => (
  <div className={`mb-6 ${className}`}>
    <label className="block text-lg font-bold text-gray-800 mb-2">{label}</label>
    <select
      className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-lilac-200 focus:border-lilac-500 bg-white"
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);