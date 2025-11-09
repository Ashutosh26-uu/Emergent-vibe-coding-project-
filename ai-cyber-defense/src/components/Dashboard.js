import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = ({ systemData, threatLevel, onSimulateAttack, onInitiateRecovery }) => {
  const [metrics, setMetrics] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (systemData) {
      setMetrics(prev => [...prev.slice(-20), {
        timestamp: new Date().toLocaleTimeString(),
        threatScore: systemData.threatScore || 0,
        systemHealth: systemData.systemHealth || 100
      }]);

      if (systemData.alert) {
        setAlerts(prev => [systemData.alert, ...prev.slice(0, 4)]);
      }
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

  return (
    <div className="dashboard">
      <div className="card">
        <h3>System Status</h3>
        <div className="metric">
          <span>Threat Level:</span>
          <span>
            <span className={`status-indicator ${getStatusColor(threatLevel)}`}></span>
            {threatLevel}
          </span>
        </div>
        <div className="metric">
          <span>System Health:</span>
          <span>{systemData?.systemHealth || 100}%</span>
        </div>
        <div className="metric">
          <span>Active Defenses:</span>
          <span>{systemData?.activeDefenses || 0}</span>
        </div>
        <div className="metric">
          <span>Last Update:</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="card">
        <h3>Threat Monitoring</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="threatScore" stroke="#ff4444" strokeWidth={2} />
            <Line type="monotone" dataKey="systemHealth" stroke="#00ff88" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3>Attack Simulation</h3>
        <button className="btn" onClick={() => onSimulateAttack('GPS_SPOOFING')}>
          Simulate GPS Spoofing
        </button>
        <button className="btn" onClick={() => onSimulateAttack('CONTROL_HIJACKING')}>
          Simulate Control Hijacking
        </button>
        <button className="btn" onClick={() => onSimulateAttack('DATA_TAMPERING')}>
          Simulate Data Tampering
        </button>
        <button className="btn btn-success" onClick={onInitiateRecovery}>
          Initiate Recovery
        </button>
      </div>

      <div className="card">
        <h3>Security Alerts</h3>
        {alerts.length === 0 ? (
          <p>No active alerts</p>
        ) : (
          alerts.map((alert, index) => (
            <div key={index} className={`alert alert-${alert.severity?.toLowerCase()}`}>
              <strong>{alert.type}:</strong> {alert.message}
              <br />
              <small>{new Date(alert.timestamp).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;