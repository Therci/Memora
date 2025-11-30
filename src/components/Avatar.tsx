import React from 'react';
import { UserIcon } from 'lucide-react';
interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
}
export function Avatar({
  src,
  alt = 'User',
  size = 'md'
}: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };
  return <div className={`${sizes[size]} bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden`}>
      {src ? <img src={src} alt={alt} className="w-full h-full object-cover" /> : <UserIcon className="w-1/2 h-1/2 text-gray-400" />}
    </div>;
}