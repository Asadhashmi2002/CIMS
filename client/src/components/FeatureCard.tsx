import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  hoverColor: string;
  shadowColor: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, hoverColor, shadowColor }) => {
  return (
    <div 
      className={`bg-white p-6 sm:p-8 rounded-xl shadow-xl ${shadowColor} ${hoverColor} transition-all duration-300 h-full hover:-translate-y-2`}
    >
      <div className="flex justify-center mb-4 sm:mb-6">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-sm sm:text-base text-center">{description}</p>
    </div>
  );
};

export default FeatureCard; 