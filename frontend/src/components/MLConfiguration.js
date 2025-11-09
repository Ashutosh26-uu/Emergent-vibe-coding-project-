import React, { useState, useEffect } from 'react';
import { getMLConfig, updateMLConfig } from '../services/api';

const MLConfiguration = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await getMLConfig();
      setConfig(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ML config:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await updateMLConfig(config);
      setMessage('✓ Configuration saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error saving configuration: ' + error.message);
    }
    setSaving(false);
  };

  const handleReset = () => {
    if (window.confirm('Reset to default configuration?')) {
      setConfig({
        ...config,
        anomaly_threshold: 2.5,
        gps_speed_threshold: 50.0,
        data_window_size: 50,
        detection_sensitivity: 'medium',
        auto_response_enabled: true
      });
    }
  };

  const getSensitivityInfo = (sensitivity) => {
    const info = {
      low: { desc: 'Fewer false alarms, may miss subtle threats', color: '#54a0ff' },
      medium: { desc: 'Balanced detection and false alarm rate', color: '#00ff88' },
      high: { desc: 'Maximum detection, higher false alarm rate', color: '#ffaa00' }
    };
    return info[sensitivity] || info.medium;
  };

  if (loading) {
    return <div className="loading">Loading ML configuration</div>;
  }

  const sensitivityInfo = getSensitivityInfo(config?.detection_sensitivity);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="card" style={{ gridColumn: '1 / -1' }} data-testid="ml-config-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>⚙️ Machine Learning Configuration</h3>
            <p style={{ color: '#aaa', marginTop: '5px', fontSize: '13px' }}>
              Fine-tune AI detection parameters and system behavior
            </p>
          </div>
          {message && (
            <div className={message.includes('✓') ? 'badge badge-success' : 'badge badge-danger'}>
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Anomaly Detection Settings */}
      <div className="card" data-testid="anomaly-detection-card">
        <h3>🧠 Anomaly Detection</h3>
        
        <div className="form-group">
          <label>
            Anomaly Threshold (Z-Score)
            <span style={{ float: 'right', color: '#00ff88' }}>{config?.anomaly_threshold}</span>
          </label>
          <input 
            type="range" 
            min="1.0" 
            max="5.0" 
            step="0.1"
            value={config?.anomaly_threshold || 2.5}
            onChange={(e) => setConfig({...config, anomaly_threshold: parseFloat(e.target.value)})}
            className="slider"
            data-testid="anomaly-threshold-slider"
          />
          <small style={{ color: '#888', fontSize: '11px' }}>
            Lower = More sensitive (1.0 - 5.0)
          </small>
        </div>

        <div className="form-group">
          <label>
            Data Window Size
            <span style={{ float: 'right', color: '#00ff88' }}>{config?.data_window_size}</span>
          </label>
          <input 
            type="range" 
            min="10" 
            max="200" 
            step="10"
            value={config?.data_window_size || 50}
            onChange={(e) => setConfig({...config, data_window_size: parseInt(e.target.value)})}
            className="slider"
            data-testid="window-size-slider"
          />
          <small style={{ color: '#888', fontSize: '11px' }}>
            Number of samples for pattern analysis (10 - 200)
          </small>
        </div>

        <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(84,160,255,0.1)', borderRadius: '5px' }}>
          <strong style={{ color: '#54a0ff' }}>Current Settings:</strong>
          <ul style={{ marginTop: '10px', fontSize: '13px', color: '#aaa', lineHeight: '1.8' }}>
            <li>Threshold: {config?.anomaly_threshold} standard deviations</li>
            <li>Window: {config?.data_window_size} samples</li>
            <li>Detection rate: ~{(95 / (config?.anomaly_threshold || 2.5) * 2).toFixed(0)}%</li>
          </ul>
        </div>
      </div>

      {/* GPS Protection Settings */}
      <div className="card" data-testid="gps-protection-card">
        <h3>📡 GPS Protection</h3>
        
        <div className="form-group">
          <label>
            Speed Anomaly Threshold (m/s)
            <span style={{ float: 'right', color: '#00ff88' }}>{config?.gps_speed_threshold}</span>
          </label>
          <input 
            type="range" 
            min="10" 
            max="200" 
            step="5"
            value={config?.gps_speed_threshold || 50}
            onChange={(e) => setConfig({...config, gps_speed_threshold: parseFloat(e.target.value)})}
            className="slider"
            data-testid="gps-threshold-slider"
          />
          <small style={{ color: '#888', fontSize: '11px' }}>
            Maximum acceptable speed change (10 - 200 m/s)
          </small>
        </div>

        <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,255,136,0.1)', borderRadius: '5px' }}>
          <strong style={{ color: '#00ff88' }}>GPS Validation Rules:</strong>
          <ul style={{ marginTop: '10px', fontSize: '13px', color: '#aaa', lineHeight: '1.8' }}>
            <li>✓ Altitude range: -500m to 50,000m</li>
            <li>✓ Speed threshold: {config?.gps_speed_threshold} m/s</li>
            <li>✓ Coordinate validity check enabled</li>
            <li>✓ Impossible movement detection active</li>
          </ul>
        </div>
      </div>

      {/* Detection Sensitivity */}
      <div className="card" data-testid="detection-sensitivity-card">
        <h3>🎯 Detection Sensitivity</h3>
        
        <div className="form-group">
          <label>Sensitivity Level</label>
          <select 
            value={config?.detection_sensitivity || 'medium'}
            onChange={(e) => setConfig({...config, detection_sensitivity: e.target.value})}
            data-testid="sensitivity-select"
          >
            <option value="low">Low - Conservative</option>
            <option value="medium">Medium - Balanced</option>
            <option value="high">High - Aggressive</option>
          </select>
        </div>

        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          background: `rgba(${sensitivityInfo.color === '#54a0ff' ? '84,160,255' : sensitivityInfo.color === '#00ff88' ? '0,255,136' : '255,170,0'},0.1)`, 
          borderRadius: '5px',
          borderLeft: `4px solid ${sensitivityInfo.color}`
        }}>
          <strong style={{ color: sensitivityInfo.color }}>
            {config?.detection_sensitivity?.toUpperCase()} Sensitivity:
          </strong>
          <p style={{ marginTop: '10px', fontSize: '13px', color: '#aaa' }}>
            {sensitivityInfo.desc}
          </p>
        </div>
      </div>

      {/* Automated Response */}
      <div className="card" data-testid="automated-response-card">
        <h3>🤖 Automated Response</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
          <label style={{ margin: 0, flex: 1 }}>Enable Auto-Response System</label>
          <label style={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            background: config?.auto_response_enabled ? 'rgba(0,255,136,0.2)' : 'rgba(255,68,68,0.2)',
            padding: '8px 15px',
            borderRadius: '20px',
            cursor: 'pointer'
          }}>
            <input 
              type="checkbox"
              checked={config?.auto_response_enabled || false}
              onChange={(e) => setConfig({...config, auto_response_enabled: e.target.checked})}
              style={{ marginRight: '8px' }}
              data-testid="auto-response-toggle"
            />
            {config?.auto_response_enabled ? '✓ ENABLED' : '❌ DISABLED'}
          </label>
        </div>

        <div style={{ padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '5px' }}>
          <strong style={{ color: '#00d2d3' }}>Automated Actions:</strong>
          <ul style={{ marginTop: '10px', fontSize: '13px', color: config?.auto_response_enabled ? '#aaa' : '#555', lineHeight: '1.8' }}>
            <li>System isolation on critical threats</li>
            <li>Automatic failover activation</li>
            <li>Emergency protocols execution</li>
            <li>Threat containment procedures</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card" style={{ gridColumn: '1 / -1' }} data-testid="config-actions-card">
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-success" 
            onClick={handleSave}
            disabled={saving}
            data-testid="save-config-btn"
            style={{ minWidth: '150px' }}
          >
            {saving ? '🔄 Saving...' : '💾 Save Configuration'}
          </button>
          <button 
            className="btn" 
            onClick={handleReset}
            disabled={saving}
            data-testid="reset-config-btn"
            style={{ minWidth: '150px' }}
          >
            ↻ Reset to Defaults
          </button>
          <button 
            className="btn btn-primary" 
            onClick={fetchConfig}
            disabled={saving}
            data-testid="refresh-config-btn"
            style={{ minWidth: '150px' }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default MLConfiguration;