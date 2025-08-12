import React from 'react';
import { WeightCutFormData, WeightUnit } from '../../types';
import { validateWeightCutForm } from '../../utils/validation';
import UnitSlider from '../UnitSlider/UnitSlider';
import './WeightCutForm.css';

interface WeightCutFormProps {
  formData: WeightCutFormData;
  loading: boolean;
  onInputChange: (name: keyof WeightCutFormData, value: string) => void;
  onUnitChange: (unit: WeightUnit) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const WeightCutForm: React.FC<WeightCutFormProps> = ({
  formData,
  loading,
  onInputChange,
  onUnitChange,
  onSubmit,
}) => {
  const validation = validateWeightCutForm(formData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onInputChange(name as keyof WeightCutFormData, value);
  };

  return (
    <div className="form-section">
      <form onSubmit={onSubmit} className="weight-form">
        <div className="form-group">
          <label htmlFor="weightUnit">Weight Unit</label>
          <UnitSlider value={formData.weightUnit} onChange={onUnitChange} />
        </div>

        <div className="form-group">
          <label htmlFor="currentWeight">
            Current Weight ({formData.weightUnit})
          </label>
          <input
            type="number"
            id="currentWeight"
            name="currentWeight"
            value={formData.currentWeight}
            onChange={handleInputChange}
            placeholder={`Enter current weight in ${formData.weightUnit}`}
            step="0.1"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="targetWeight">
            Target Weight ({formData.weightUnit})
          </label>
          <input
            type="number"
            id="targetWeight"
            name="targetWeight"
            value={formData.targetWeight}
            onChange={handleInputChange}
            placeholder={`Enter target weight in ${formData.weightUnit}`}
            step="0.1"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="daysTillFight">Days Until Fight</label>
          <input
            type="number"
            id="daysTillFight"
            name="daysTillFight"
            value={formData.daysTillFight}
            onChange={handleInputChange}
            placeholder="Enter days until fight"
            min="1"
            required
          />
        </div>

        <button
          type="submit"
          className="calculate-btn"
          disabled={loading || !validation.isValid}
        >
          {loading ? 'Generating Plan...' : 'Calculate Weight Cut Plan'}
        </button>
      </form>
    </div>
  );
};

export default WeightCutForm;
