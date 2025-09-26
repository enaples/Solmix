import React from 'react';
import DetectorCard from './VulCard';
import { Props } from './types';

const VulCardList: React.FC<Props> = ({ data, toKeep, defaultData}) => {
const filteredDetectors = data.detectors
    .filter(detector => (toKeep ?? []).includes(detector.impact));

return (
    <div className="max-h-[600px] overflow-y-auto pr-2">
        {filteredDetectors.length > 0 ? 
            filteredDetectors.map((detector, index) => (
                <DetectorCard key={index} detector={detector} />
            ))
            : defaultData && <DetectorCard detector={defaultData} />
        }
    </div>
);
};

export default VulCardList;