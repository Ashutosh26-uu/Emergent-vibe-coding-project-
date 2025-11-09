import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getMetrics, getThreats } from '../services/api';

const ThreatAnalysis = () => {
  const [metrics, setMetrics] = useState(null);
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [metricsData, threatsData] = await Promise.all([
        getMetrics(),
        getThreats(20, false)
      ]);
      setMetrics(metricsData);
      setThreats(threatsData.threats || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analysis data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading threat analysis</div>;
  }

  const threatDistribution = [
    { name: 'GPS Spoofing', value: metrics?.threat_distribution?.gps_spoofing || 0, color: '#ff4444' },
    { name: 'Control Hijack', value: metrics?.threat_distribution?.control_hijacking || 0, color: '#ff6b6b' },
    { name: 'Data Tampering', value: metrics?.threat_distribution?.data_tampering || 0, color: '#ffaa00' },
    { name: 'Anomalies', value: metrics?.threat_distribution?.anomalies || 0, color: '#54a0ff' }
  ];

  const detectionMetrics = [
    { name: 'Total Threats', value: metrics?.total_threats || 0 },
    { name: 'Resolved', value: metrics?.resolved_threats || 0 },
    { name: 'Active', value: metrics?.active_threats || 0 }
  ];

  const accuracy = ((metrics?.detection_rate || 0) * 100).toFixed(1);
  const falsePositiveRate = ((metrics?.false_positive_rate || 0) * 100).toFixed(1);

  return (
    <div className="dashboard">
      {/* Threat Distribution */}
      <div className="card" data-testid="threat-distribution-card">
        <h3>📊 Threat Distribution</h3>
        {threatDistribution.some(t => t.value > 0) ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={threatDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
              >
                {threatDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '5px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            No threats detected yet
          </div>
        )}
      </div>

      {/* Detection Performance */}
      <div className="card" data-testid="detection-performance-card">
        <h3>🎯 Detection Performance</h3>
        <div className="metric">
          <span>Detection Accuracy:</span>
          <span className="badge badge-success">{accuracy}%</span>
        </div>
        <div className="metric">
          <span>False Positive Rate:</span>
          <span className="badge badge-warning">{falsePositiveRate}%</span>
        </div>
        <div className="metric">
          <span>Total Detections:</span>
          <span>{metrics?.total_threats || 0}</span>
        </div>
        <ResponsiveContainer width="100%" height={220} style={{ marginTop: '20px' }}>
          <BarChart data={detectionMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#888" style={{ fontSize: '12px' }} />
            <YAxis stroke="#888" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(0,0,0,0.8)', 
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '5px'
              }}
            />
            <Bar dataKey="value" fill="#00ff88" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Active Threats */}
      <div className="card" data-testid="active-threats-card">
        <h3>⚠️ Active Threats</h3>
        {threats.length > 0 ? (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {threats.map((threat, index) => (
              <div 
                key={index} 
                className="alert alert-critical"
                style={{ marginBottom: '10px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{threat.threat_type?.replace('_', ' ')}</strong>
                    <br />
                    <span className={`badge badge-${threat.severity === 'CRITICAL' ? 'danger' : 'warning'}`}>
                      {threat.severity}
                    </span>
                    <span style={{ marginLeft: '10px', fontSize: '11px', color: '#888' }}>
                      Confidence: {(threat.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    {new Date(threat.detected_at).toLocaleString()}
                  </div>
                </div>
                {threat.details && (
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#aaa' }}>
                    Vehicle: {threat.vehicle_id}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            ✓ No active threats detected
          </div>
        )}
      </div>

      {/* System Statistics */}
      <div className="card" data-testid="system-statistics-card">
        <h3>📈 System Statistics</h3>
        <div className="grid-2">
          <div className="metric">
            <span>Total Threats:</span>
            <span>{metrics?.total_threats || 0}</span>
          </div>
          <div className="metric">
            <span>Resolved:</span>
            <span>{metrics?.resolved_threats || 0}</span>
          </div>
          <div className="metric">
            <span>Active:</span>
            <span style={{ color: '#ff4444' }}>{metrics?.active_threats || 0}</span>
          </div>
          <div className="metric">
            <span>Resolution Rate:</span>
            <span>
              {metrics?.total_threats > 0 
                ? ((metrics.resolved_threats / metrics.total_threats) * 100).toFixed(1) 
                : 0}%
            </span>
          </div>
        </div>
        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,255,136,0.1)', borderRadius: '5px' }}>
          <h4 style={{ color: '#00ff88', marginBottom: '10px' }}>🛡️ Defense Highlights</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>✓ Real-time threat detection active</li>
            <li style={{ marginBottom: '8px' }}>✓ AI anomaly detection operational</li>
            <li style={{ marginBottom: '8px' }}>✓ Automated response systems ready</li>
            <li>✓ Multi-vector defense engaged</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ThreatAnalysis;