import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'text' }) => {
  const variantStyles = {
    text: 'rounded-lg',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return <div className={`bg-gray-200 animate-pulse ${variantStyles[variant]} ${className}`} />;
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-18 w-full" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton height="h-6" width="w-32" />
          <Skeleton height="h-8" width="w-20" />
        </div>
        <Skeleton height="h-5" width="w-full" />
        <Skeleton height="h-5" width="w-3/4" />
        <Skeleton height="h-5" width="w-1/2" />
      </div>
    </div>
  );
};

export const SkeletonSection: React.FC<{ type?: 'text' | 'image' | 'list' }> = ({ type = 'text' }) => {
  if (type === 'image') {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-18 w-full" />
        <div className="p-6">
          <div className="flex flex-col items-center">
            <Skeleton height="h-64" width="w-full" className="rounded-xl mb-4" variant="rectangular" />
            <Skeleton height="h-10" width="w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 h-18 w-full" />
        <div className="p-6 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border-l-4 border-indigo-200 pl-4">
              <div className="flex justify-between items-center mb-3">
                <Skeleton height="h-6" width="w-40" />
                <div className="flex gap-2">
                  <Skeleton height="h-6" width="w-16" />
                  <Skeleton height="h-6" width="w-20" />
                </div>
              </div>
              <Skeleton height="h-4" width="w-full" className="mb-2" />
              <Skeleton height="h-4" width="w-5/6" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-18 w-full" />
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <Skeleton height="h-8" width="w-20" />
        </div>
        <div className="space-y-3">
          <Skeleton height="h-4" width="w-full" />
          <Skeleton height="h-4" width="w-full" />
          <Skeleton height="h-4" width="w-3/4" />
          <Skeleton height="h-4" width="w-full" />
          <Skeleton height="h-4" width="w-5/6" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Processing video data...</p>
          <p className="text-gray-400 text-sm mt-1">This may take a few minutes</p>
        </div>
      </div>
      <SkeletonCard />
      <SkeletonSection type="text" />
      <SkeletonSection type="list" />
      <SkeletonSection type="image" />
    </div>
  );
};