import React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}
export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 font-mono text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm';
  const variants = {
    primary: 'bg-gray-700 text-white hover:bg-gray-800 border border-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    secondary: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 border border-transparent focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
  };
  return <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>;
}