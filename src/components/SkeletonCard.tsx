import React from 'react';

export function SkeletonCard() {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="flex-1">
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-2 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
      <div className="h-40 bg-gray-200 rounded mb-3" />
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  );
}
