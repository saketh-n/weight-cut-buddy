import React from 'react';
import { WeightCutResponse } from '../../types';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import WeightCutResult from '../WeightCutResult/WeightCutResult';
import './ResultSection.css';

interface ResultSectionProps {
  loading: boolean;
  error: string;
  result: WeightCutResponse | null;
  onRetry?: () => void;
}

const ResultSection: React.FC<ResultSectionProps> = ({
  loading,
  error,
  result,
  onRetry,
}) => {
  return (
    <div className="result-section">
      {loading && <LoadingSpinner />}
      
      {error && (
        <ErrorMessage message={error} onRetry={onRetry} />
      )}
      
      {result && !loading && !error && (
        <WeightCutResult result={result} />
      )}
      
      {!loading && !error && !result && (
        <div className="empty-state">
          <h3>🥊 Ready to Generate Your Plan</h3>
          <p>Fill in your details on the left and click "Calculate Weight Cut Plan" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ResultSection;
