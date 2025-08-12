export interface WeightCutFormData {
  currentWeight: string;
  targetWeight: string;
  daysTillFight: string;
  weightUnit: 'lbs' | 'kg';
}

export interface WeightCutRequest {
  current_weight: number;
  target_weight: number;
  days_till_fight: number;
  weight_unit: 'lbs' | 'kg';
}

export interface WeightCutResponse {
  plan: string;
  warning_message: string;
  is_safe: boolean;
}

export interface ApiError {
  detail: string;
}

export type WeightUnit = 'lbs' | 'kg';

export interface FormValidation {
  isValid: boolean;
  errors: string[];
}
