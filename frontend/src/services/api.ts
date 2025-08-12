import { WeightCutRequest, WeightCutResponse, ApiError } from '../types';

const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  async generateWeightCutPlan(request: WeightCutRequest): Promise<WeightCutResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.detail || 'Failed to generate plan');
      }

      const data: WeightCutResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async healthCheck(): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      if (!response.ok) {
        throw new Error('Health check failed');
      }
      return await response.json();
    } catch (error) {
      throw new Error('Unable to connect to server');
    }
  }
}

export const apiService = new ApiService();
