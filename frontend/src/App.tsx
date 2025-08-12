import React from 'react';
import Header from './components/Header/Header';
import WeightCutForm from './components/WeightCutForm/WeightCutForm';
import ResultSection from './components/ResultSection/ResultSection';
import { useWeightCutForm } from './hooks/useWeightCutForm';
import './App.css';

const App: React.FC = () => {
  const {
    formData,
    loading,
    result,
    error,
    handleInputChange,
    handleUnitChange,
    handleSubmit,
    handleRetry,
  } = useWeightCutForm();

  return (
    <div className="App">
      <div className="container">
        <Header />
        
        <div className="content">
          <WeightCutForm
            formData={formData}
            loading={loading}
            onInputChange={handleInputChange}
            onUnitChange={handleUnitChange}
            onSubmit={handleSubmit}
          />
          
          <ResultSection
            loading={loading}
            error={error}
            result={result}
            onRetry={handleRetry}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
