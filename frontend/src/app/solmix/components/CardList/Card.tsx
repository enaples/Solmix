import { DetectorCardProps, impactToColor } from './types';
import React from 'react';

const DetectorCard: React.FC<DetectorCardProps> = ({ detector }) => {
  const { check, impact, description, first_markdown_element, markdown } = detector;

  return (
    <div className="bg-black border border-gray-700 rounded-lg p-4 mb-4 shadow-md text-white">
      <h3 className={`text-xl font-bold mb-2 ${impactToColor[impact]}`}>
        {check}: {impact}
      </h3>
      <p className="mb-4 text-gray-300">{description}</p>
      
      <div className="mt-4">
        <p className="font-mono text-blue-400 underline">{first_markdown_element}</p>
        <pre className="mt-2 p-2 bg-gray-900 rounded text-sm overflow-x-auto">
          <code>{markdown}</code>
        </pre>
      </div>
    </div>
  );
};

export default DetectorCard;