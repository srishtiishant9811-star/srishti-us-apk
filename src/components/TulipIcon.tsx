import React from 'react';

interface TulipIconProps {
  className?: string;
  size?: number;
  variant?: 'logo' | 'simple' | 'blooming' | 'glowing';
  color?: string;
}

export const TulipIcon: React.FC<TulipIconProps> = ({
  className = 'w-6 h-6',
  size = 24,
  variant = 'simple',
  color = 'currentColor',
}) => {
  if (variant === 'logo') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105"
        >
          <defs>
            <linearGradient id="tulipGradient" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="petalGlow" x1="24" y1="6" x2="24" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
            </linearGradient>
            <filter id="tulipSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Central Stem */}
          <path
            d="M24 30V44M24 36C28 36 32 39 33 42M24 38C20 38 16 41 15 44"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Left Petal */}
          <path
            d="M13.5 24C11 18 13 12 17 8C19 14 18 25 24 29C19 29 15 27 13.5 24Z"
            fill="url(#tulipGradient)"
            opacity="0.9"
          />

          {/* Right Petal */}
          <path
            d="M34.5 24C37 18 35 12 31 8C29 14 30 25 24 29C29 29 33 27 34.5 24Z"
            fill="url(#tulipGradient)"
            opacity="0.9"
          />

          {/* Center Main Petal with gentle crest */}
          <path
            d="M24 6C18 10 18 24 24 31C30 24 30 10 24 6Z"
            fill="url(#petalGlow)"
            stroke="#a7f3d0"
            strokeWidth="1.2"
          />

          {/* Inner Light Reflection Accent */}
          <path
            d="M23 11C21 16 21 22 24 26"
            stroke="#d1fae5"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      </div>
    );
  }

  // Simple / blooming standard SVG
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Stem */}
      <path d="M12 15V22" />
      <path d="M12 18C14 18 16 19.5 17 21" />
      <path d="M12 19C10 19 8 20.5 7 22" />

      {/* Petals */}
      <path d="M7 11.5C5.5 8 6.5 4.5 9 2.5C10 6 9.5 12 12 14.5C9.5 14.5 7.5 13.5 7 11.5Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M17 11.5C18.5 8 17.5 4.5 15 2.5C14 6 14.5 12 12 14.5C14.5 14.5 16.5 13.5 17 11.5Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M12 2C8.5 5 8.5 12 12 15.5C15.5 12 15.5 5 12 2Z" fill="currentColor" fillOpacity="0.35" />
    </svg>
  );
};
