import { useState, useCallback } from 'react';
import { WeightCutFormData, WeightCutResponse, WeightUnit } from '../types';
import { apiService } from '../services/api';
import { convertFormDataToRequest } from '../utils/validation';

const initialFormData: WeightCutFormData = {
  currentWeight: '',
  targetWeight: '',
  daysTillFight: '',
  weightUnit: 'lbs',
};

export const useWeightCutForm = () => {
  const [formData, setFormData] = useState<WeightCutFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WeightCutResponse | null>(null);
  const [error, setError] = useState('');

  const handleInputChange = useCallback((name: keyof WeightCutFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleUnitChange = useCallback((unit: WeightUnit) => {
    setFormData(prev => ({
      ...prev,
      weightUnit: unit,
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const request = convertFormDataToRequest(formData);
      const response = await apiService.generateWeightCutPlan(request);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const handleRetry = useCallback(() => {
    setError('');
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  }, [handleSubmit]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setResult(null);
    setError('');
    setLoading(false);
  }, []);

  return {
    formData,
    loading,
    result,
    error,
    handleInputChange,
    handleUnitChange,
    handleSubmit,
    handleRetry,
    resetForm,
  };
};
