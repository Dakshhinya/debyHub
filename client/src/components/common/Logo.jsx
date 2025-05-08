import React from 'react';
import { MessageSquare } from 'lucide-react';

const Logo = ({ className = "h-10 w-10" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 bg-primary rounded-lg rotate-12"></div>
      <div className="absolute inset-0 bg-accent rounded-lg -rotate-12 opacity-80"></div>
      <MessageSquare className="relative z-10 text-white" size={24} />
    </div>
  );
};

export default Logo;