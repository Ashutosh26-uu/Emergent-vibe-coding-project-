import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = ({ systemData, onSimulateAttack, onInitiateRecovery, loading }) => {
  const [metrics, setMetrics] = useState([]);
  const [recentThreats, setRecentThreats] = useState([]);

  useEffect(() => {
    if (systemData) {
      setMetrics(prev => {
        const newMetrics = [...prev, {
          timestamp: new Date().toLocaleTimeString(),
          threatScore: systemData.active_threats || 0,
          systemHealth: systemData.system_health || 100
        }];
        return newMetrics.slice(-30); // Keep last 30 data points
      });
    }
  }, [systemData]);

  useEffect(() => {
    if (systemData?.recent_threats) {
      setRecentThreats(systemData.recent_threats);
    }
  }, [systemData]);

  const getStatusColor = (level) => {
    switch (level) {
      case 'LOW': return 'status-secure';
      case 'MEDIUM': return 'status-warning';
      case 'HIGH': case 'CRITICAL': return 'status-critical';
      default: return 'status-secure';
    }
  };

  const getThreatLevelText = (level) => {
    const levels = {
      'LOW': '🛡️ SECURE',
      'MEDIUM': '⚠️ ELEVATED',
      'HIGH': '🚨 HIGH ALERT',
      'CRITICAL': '☢️ CRITICAL'
    };
    return levels[level] || level;
  };

  return (
    <div className="dashboard">
      {/* System Status Card */}
      <div className="card" data-testid="system-status-card">
        <h3>🔒 System Status</h3>
        <div className="metric">
          <span>Threat Level:</span>
          <span>
            <span className={`status-indicator ${getStatusColor(systemData?.threat_level)}`}></span>
            {getThreatLevelText(systemData?.threat_level)}
          </span>
        </div>
        <div className="metric">
          <span>System Health:</span>
          <span style={{ color: systemData?.system_health > 70 ? '#00ff88' : '#ff4444' }}>
            {systemData?.system_health || 100}%
          </span>
        </div>
        <div className="metric">
          <span>Active Threats:</span>
          <span style={{ color: systemData?.active_threats > 0 ? '#ff4444' : '#00ff88' }}>
            {systemData?.active_threats || 0}
          </span>
        </div>
        <div className="metric">
          <span>Active Vehicles:</span>
          <span>{systemData?.active_vehicles || 0}</span>
        </div>
        <div className="metric">
          <span>Status:</span>
          <span className="badge badge-success">{systemData?.status || 'OPERATIONAL'}</span>
        </div>
        <div className="metric">
          <span>Last Update:</span>
          <span style={{ fontSize: '12px', color: '#888' }}>
            {systemData?.timestamp ? new Date(systemData.timestamp).toLocaleTimeString() : 'N/A'}
          </span>
        </div>
      </div>

      {/* Real-time Monitoring Chart */}
      <div className="card" data-testid="monitoring-chart">
        <h3>📊 Real-time Monitoring</h3>
        {metrics.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#888" 
                style={{ fontSize: '11px' }}
              />
              <YAxis stroke="#888" style={{ fontSize: '11px' }} />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '5px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="threatScore" 
                stroke="#ff4444" 
                strokeWidth={2}
                name="Active Threats"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="systemHealth" 
                stroke="#00ff88" 
                strokeWidth={2}
                name="System Health %"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            Collecting data...
          </div>
        )}
      </div>

      {/* Attack Simulation Controls */}
      <div className="card" data-testid="attack-simulation-card">
        <h3>🎯 Attack Simulation</h3>
        <p style={{ color: '#aaa', marginBottom: '15px', fontSize: '13px' }}>
          Test the defense system by simulating various cyber attacks
        </p>
        <button 
          className="btn" 
          onClick={() => onSimulateAttack('GPS_SPOOFING')}
          disabled={loading}
          data-testid="simulate-gps-spoofing-btn"
        >
          📡 GPS Spoofing
        </button>
        <button 
          className="btn" 
          onClick={() => onSimulateAttack('CONTROL_HIJACKING')}
          disabled={loading}
          data-testid="simulate-control-hijacking-btn"
        >
          🎮 Control Hijacking
        </button>
        <button 
          className="btn" 
          onClick={() => onSimulateAttack('DATA_TAMPERING')}
          disabled={loading}
          data-testid="simulate-data-tampering-btn"
        >
          💾 Data Tampering
        </button>
        <br />
        <button 
          className="btn btn-success" 
          onClick={onInitiateRecovery}
          disabled={loading}
          data-testid="initiate-recovery-btn"
          style={{ marginTop: '10px' }}
        >
          🔧 Initiate Recovery
        </button>
      </div>

      {/* Recent Alerts */}
      <div className="card" data-testid="recent-alerts-card">
        <h3>🚨 Recent Alerts</h3>
        {recentThreats && recentThreats.length > 0 ? (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {recentThreats.map((threat, index) => (
              <div 
                key={index} 
                className={`alert alert-${threat.severity?.toLowerCase() === 'critical' ? 'critical' : 'warning'}`}
              >
                <strong>{threat.threat_type?.replace('_', ' ')}:</strong>
                <br />
                <span>Severity: {threat.severity}</span>
                <br />
                <span style={{ fontSize: '11px', color: '#888' }}>
                  Confidence: {(threat.confidence * 100).toFixed(1)}%
                </span>
                <br />
                <small style={{ fontSize: '11px', color: '#888' }}>
                  {new Date(threat.detected_at).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            ✓ No active alerts - System operating normally
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;