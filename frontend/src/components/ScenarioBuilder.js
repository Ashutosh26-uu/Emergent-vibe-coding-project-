import React, { useState, useEffect } from 'react';
import { getScenarios, createScenario, deleteScenario } from '../services/api';

const ScenarioBuilder = () => {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    threat_type: 'GPS_SPOOFING',
    parameters: '{}'
  });

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const data = await getScenarios();
      setScenarios(data.scenarios || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parameters = JSON.parse(formData.parameters);
      await createScenario({
        ...formData,
        parameters,
        scenario_id: '',
        created_at: new Date().toISOString(),
        is_custom: true
      });
      setShowForm(false);
      setFormData({ name: '', description: '', threat_type: 'GPS_SPOOFING', parameters: '{}' });
      fetchScenarios();
    } catch (error) {
      alert('Error creating scenario: ' + error.message);
    }
  };

  const handleDelete = async (scenarioId, isCustom) => {
    if (!isCustom) {
      alert('Cannot delete built-in scenarios');
      return;
    }
    if (window.confirm('Are you sure you want to delete this scenario?')) {
      try {
        await deleteScenario(scenarioId);
        fetchScenarios();
      } catch (error) {
        alert('Error deleting scenario: ' + error.message);
      }
    }
  };

  const threatTypeExamples = {
    GPS_SPOOFING: '{ "altitude": -1000, "speed": 500, "latitude": 0, "longitude": 0 }',
    CONTROL_HIJACKING: '{ "source": "UNKNOWN_SOURCE", "invalid_checksum": true }',
    DATA_TAMPERING: '{ "sensor_corruption": true, "corruption_level": 0.8 }',
    ANOMALY_DETECTED: '{ "deviation_factor": 0.5, "sustained_duration": 30 }'
  };

  if (loading) {
    return <div className="loading">Loading scenarios</div>;
  }

  return (
    <div className="dashboard">
      {/* Header Card */}
      <div className="card" style={{ gridColumn: '1 / -1' }} data-testid="scenario-builder-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>🎯 Custom Attack Scenarios</h3>
            <p style={{ color: '#aaa', marginTop: '5px', fontSize: '13px' }}>
              Create and manage custom attack scenarios to test your defense system
            </p>
          </div>
          <button 
            className="btn btn-success" 
            onClick={() => setShowForm(!showForm)}
            data-testid="create-scenario-btn"
          >
            {showForm ? '❌ Cancel' : '+ Create Scenario'}
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card" style={{ gridColumn: '1 / -1' }} data-testid="scenario-form">
          <h3>➕ New Attack Scenario</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Scenario Name *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="e.g., Advanced GPS Manipulation"
                data-testid="scenario-name-input"
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the attack scenario..."
                rows="3"
                data-testid="scenario-description-input"
              />
            </div>
            
            <div className="form-group">
              <label>Threat Type *</label>
              <select 
                value={formData.threat_type}
                onChange={(e) => {
                  const type = e.target.value;
                  setFormData({
                    ...formData, 
                    threat_type: type,
                    parameters: threatTypeExamples[type]
                  });
                }}
                data-testid="scenario-threat-type-select"
              >
                <option value="GPS_SPOOFING">GPS Spoofing</option>
                <option value="CONTROL_HIJACKING">Control Hijacking</option>
                <option value="DATA_TAMPERING">Data Tampering</option>
                <option value="ANOMALY_DETECTED">Anomaly Detection</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Parameters (JSON) *</label>
              <textarea 
                value={formData.parameters}
                onChange={(e) => setFormData({...formData, parameters: e.target.value})}
                placeholder='{"key": "value"}'
                rows="4"
                required
                style={{ fontFamily: 'monospace', fontSize: '12px' }}
                data-testid="scenario-parameters-input"
              />
              <small style={{ color: '#888', fontSize: '11px' }}>
                Define attack-specific parameters in JSON format
              </small>
            </div>
            
            <button type="submit" className="btn btn-success" data-testid="save-scenario-btn">
              💾 Save Scenario
            </button>
          </form>
        </div>
      )}

      {/* Scenarios List */}
      {scenarios.map((scenario, index) => (
        <div key={index} className="card" data-testid={`scenario-card-${index}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1em' }}>{scenario.name}</h3>
            {scenario.is_custom ? (
              <span className="badge badge-info">CUSTOM</span>
            ) : (
              <span className="badge badge-success">BUILT-IN</span>
            )}
          </div>
          
          <p style={{ color: '#aaa', marginBottom: '15px', fontSize: '13px' }}>
            {scenario.description}
          </p>
          
          <div className="metric">
            <span>Threat Type:</span>
            <span className="badge badge-warning">{scenario.threat_type.replace('_', ' ')}</span>
          </div>
          
          <div className="metric">
            <span>Created:</span>
            <span style={{ fontSize: '12px', color: '#888' }}>
              {new Date(scenario.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <div style={{ marginTop: '15px' }}>
            <details>
              <summary style={{ cursor: 'pointer', color: '#00d2d3', fontSize: '13px' }}>
                View Parameters
              </summary>
              <pre style={{ 
                background: 'rgba(0,0,0,0.3)', 
                padding: '10px', 
                borderRadius: '5px',
                marginTop: '10px',
                fontSize: '11px',
                overflowX: 'auto'
              }}>
                {JSON.stringify(scenario.parameters, null, 2)}
              </pre>
            </details>
          </div>
          
          {scenario.is_custom && (
            <button 
              className="btn" 
              onClick={() => handleDelete(scenario.scenario_id, scenario.is_custom)}
              style={{ marginTop: '15px', width: '100%' }}
              data-testid={`delete-scenario-btn-${index}`}
            >
              🗑️ Delete Scenario
            </button>
          )}
        </div>
      ))}

      {scenarios.length === 0 && (
        <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#888' }}>No scenarios created yet. Create your first custom attack scenario!</p>
        </div>
      )}
    </div>
  );
};

export default ScenarioBuilder;