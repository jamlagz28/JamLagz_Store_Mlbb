import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  padding = 'md'
}) => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
  
  return (
    <div className={`
      bg-white dark:bg-dark-200 rounded-xl shadow-lg
      ${hover ? 'transition-all duration-300 hover:shadow-2xl hover:-translate-y-1' : ''}
      ${paddings[padding]}
      ${className}
    `}>
      {children}
    </div>
  );
};