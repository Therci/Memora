import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
}
export function Input({
  label,
  error,
  multiline = false,
  className = '',
  ...props
}: InputProps) {
  const baseStyles = 'w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 font-mono text-sm focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-400 transition-colors rounded-lg';
  const inputElement = multiline ? <textarea className={`${baseStyles} ${className} resize-none`} rows={5} {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>} /> : <input className={`${baseStyles} ${className}`} {...props as React.InputHTMLAttributes<HTMLInputElement>} />;
  return <div className="w-full">
      {label && <label className="block text-sm font-mono text-gray-600 mb-1">
          {label}
        </label>}
      {inputElement}
      {error && <p className="mt-1 text-sm font-mono text-red-600">{error}</p>}
    </div>;
}