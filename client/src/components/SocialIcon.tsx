import React from 'react';

interface SocialIconProps {
  name: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
}

const SocialIcon: React.FC<SocialIconProps> = ({ name }) => {
  let path;
  
  switch (name) {
    case 'facebook':
      path = <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />;
      break;
    case 'twitter':
      path = <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />;
      break;
    case 'instagram':
      path = <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 4h9a3.5 3.5 0 013.5 3.5v9a3.5 3.5 0 01-3.5 3.5h-9A3.5 3.5 0 014 16.5v-9A3.5 3.5 0 017.5 4zm9 0h.01" />;
      break;
    case 'linkedin':
      path = <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" />;
      break;
    default:
      path = <path />;
  }
  
  return (
    <a 
      href="#" 
      className="text-gray-300 hover:text-white transition-colors hover:scale-110 inline-block"
    >
      <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 sm:h-6 sm:w-6"
        xmlns="http://www.w3.org/2000/svg"
      >
        {path}
      </svg>
    </a>
  );
};

export default SocialIcon; 