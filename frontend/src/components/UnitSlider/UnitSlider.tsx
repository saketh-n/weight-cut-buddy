import React from 'react';
import { WeightUnit } from '../../types';
import './UnitSlider.css';

interface UnitSliderProps {
  value: WeightUnit;
  onChange: (unit: WeightUnit) => void;
}

const UnitSlider: React.FC<UnitSliderProps> = ({ value, onChange }) => {
  const handleToggle = () => {
    onChange(value === 'lbs' ? 'kg' : 'lbs');
  };

  return (
    <div className="unit-slider">
      <div className="slider-container">
        <span className={`slider-label ${value === 'lbs' ? 'active' : ''}`}>
          LBS
        </span>
        <div className="slider-track" onClick={handleToggle}>
          <div className={`slider-thumb ${value === 'kg' ? 'right' : 'left'}`} />
        </div>
        <span className={`slider-label ${value === 'kg' ? 'active' : ''}`}>
          KG
        </span>
      </div>
    </div>
  );
};

export default UnitSlider;
