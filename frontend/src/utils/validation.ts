import { WeightCutFormData, FormValidation } from '../types';

export const validateWeightCutForm = (formData: WeightCutFormData): FormValidation => {
  const errors: string[] = [];

  // Check if all fields are filled
  if (!formData.currentWeight) {
    errors.push('Current weight is required');
  }

  if (!formData.targetWeight) {
    errors.push('Target weight is required');
  }

  if (!formData.daysTillFight) {
    errors.push('Days until fight is required');
  }

  // Validate numeric values
  const currentWeight = parseFloat(formData.currentWeight);
  const targetWeight = parseFloat(formData.targetWeight);
  const daysTillFight = parseInt(formData.daysTillFight);

  if (formData.currentWeight && (isNaN(currentWeight) || currentWeight <= 0)) {
    errors.push('Current weight must be a positive number');
  }

  if (formData.targetWeight && (isNaN(targetWeight) || targetWeight <= 0)) {
    errors.push('Target weight must be a positive number');
  }

  if (formData.daysTillFight && (isNaN(daysTillFight) || daysTillFight <= 0)) {
    errors.push('Days until fight must be a positive number');
  }

  // Check if current weight is higher than target weight
  if (!isNaN(currentWeight) && !isNaN(targetWeight) && currentWeight <= targetWeight) {
    errors.push('Current weight must be higher than target weight');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const convertFormDataToRequest = (formData: WeightCutFormData) => {
  return {
    current_weight: parseFloat(formData.currentWeight),
    target_weight: parseFloat(formData.targetWeight),
    days_till_fight: parseInt(formData.daysTillFight),
    weight_unit: formData.weightUnit,
  };
};
