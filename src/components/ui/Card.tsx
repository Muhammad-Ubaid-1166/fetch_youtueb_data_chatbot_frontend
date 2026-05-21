import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

interface CardHeaderProps {
  title: string;
  gradient?: string;
  action?: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false }) => {
  const hoverStyles = hoverable
    ? 'transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1'
    : '';

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  gradient = 'from-blue-600 to-purple-600',
  action,
  className = '',
}) => {
  return (
    <div className={`bg-gradient-to-r ${gradient} px-6 py-5 ${className}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-white/30 rounded-full"></div>
          <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};