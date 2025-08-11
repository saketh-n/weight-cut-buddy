import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    currentWeight: '',
    targetWeight: '',
    daysTillFight: '',
    weightUnit: 'lbs'
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUnitToggle = () => {
    setFormData(prev => ({
      ...prev,
      weightUnit: prev.weightUnit === 'lbs' ? 'kg' : 'lbs'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_weight: parseFloat(formData.currentWeight),
          target_weight: parseFloat(formData.targetWeight),
          days_till_fight: parseInt(formData.daysTillFight),
          weight_unit: formData.weightUnit
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate plan');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.currentWeight && 
           formData.targetWeight && 
           formData.daysTillFight &&
           parseFloat(formData.currentWeight) > parseFloat(formData.targetWeight);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🥊 Weight Cut Buddy</h1>
          <p>Personalized diet and dehydration plans for combat sport athletes</p>
        </header>

        <div className="content">
          <div className="form-section">
            <form onSubmit={handleSubmit} className="weight-form">
              <div className="form-group">
                <label htmlFor="weightUnit">Weight Unit</label>
                <div className="unit-slider">
                  <div className="slider-container">
                    <span className={`slider-label ${formData.weightUnit === 'lbs' ? 'active' : ''}`}>LBS</span>
                    <div className="slider-track" onClick={handleUnitToggle}>
                      <div className={`slider-thumb ${formData.weightUnit === 'kg' ? 'right' : 'left'}`}></div>
                    </div>
                    <span className={`slider-label ${formData.weightUnit === 'kg' ? 'active' : ''}`}>KG</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="currentWeight">Current Weight ({formData.weightUnit})</label>
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
                <label htmlFor="targetWeight">Target Weight ({formData.weightUnit})</label>
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
                disabled={loading || !isFormValid()}
              >
                {loading ? 'Generating Plan...' : 'Calculate Weight Cut Plan'}
              </button>
            </form>
          </div>

          <div className="result-section">
            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Generating your personalized weight cut plan...</p>
              </div>
            )}

            {error && (
              <div className="error">
                <h3>❌ Error</h3>
                <p>{error}</p>
              </div>
            )}

            {result && (
              <div className="result">
                {result.warning_message && (
                  <div className="warning">
                    <h3>⚠️ Safety Warning</h3>
                    <p>{result.warning_message}</p>
                  </div>
                )}
                
                <div className="plan">
                  <h3>📋 Your Weight Cut Plan</h3>
                  <div className="plan-content">
                    <pre>{result.plan}</pre>
                  </div>
                </div>

                <div className="disclaimer">
                  <p><strong>⚠️ IMPORTANT DISCLAIMER:</strong></p>
                  <p>This plan is generated by AI and should be reviewed by a qualified sports nutritionist or medical professional. Always prioritize your health and safety over making weight.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
