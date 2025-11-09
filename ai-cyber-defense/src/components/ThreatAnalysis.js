import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ThreatAnalysis = ({ threatData, detectionResults }) => {
  const threatTypes = [
    { name: 'GPS Spoofing', value: threatData?.gpsSpoofing || 0, color: '#ff4444' },
    { name: 'Control Hijacking', value: threatData?.controlHijacking || 0, color: '#ff6b6b' },
    { name: 'Data Tampering', value: threatData?.dataTampering || 0, color: '#ffaa00' },
    { name: 'Anomalies', value: threatData?.anomalies || 0, color: '#54a0ff' }
  ];

  const detectionMetrics = [
    { name: 'True Positives', value: detectionResults?.truePositives || 0 },
    { name: 'False Positives', value: detectionResults?.falsePositives || 0 },
    { name: 'True Negatives', value: detectionResults?.trueNegatives || 0 },
    { name: 'False Negatives', value: detectionResults?.falseNegatives || 0 }
  ];

  const accuracy = detectionResults ? 
    ((detectionResults.truePositives + detectionResults.trueNegatives) / 
     (detectionResults.truePositives + detectionResults.trueNegatives + 
      detectionResults.falsePositives + detectionResults.falseNegatives) * 100).toFixed(1) : 0;

  return (
    <div className="dashboard">
      <div className="card">
        <h3>Threat Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={threatTypes}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {threatTypes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3>Detection Performance</h3>
        <div className="metric">
          <span>Accuracy:</span>
          <span>{accuracy}%</span>
        </div>
        <div className="metric">
          <span>Precision:</span>
          <span>
            {detectionResults ? 
              (detectionResults.truePositives / 
               (detectionResults.truePositives + detectionResults.falsePositives) * 100).toFixed(1) : 0}%
          </span>
        </div>
        <div className="metric">
          <span>Recall:</span>
          <span>
            {detectionResults ? 
              (detectionResults.truePositives / 
               (detectionResults.truePositives + detectionResults.falseNegatives) * 100).toFixed(1) : 0}%
          </span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={detectionMetrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#00ff88" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3>Real-time Analysis</h3>
        {detectionResults?.currentThreat ? (
          <div>
            <div className="alert alert-critical">
              <strong>Active Threat Detected:</strong> {detectionResults.currentThreat.type}
              <br />
              <strong>Confidence:</strong> {(detectionResults.currentThreat.confidence * 100).toFixed(1)}%
              <br />
              <strong>Severity:</strong> {detectionResults.currentThreat.severity}
            </div>
            <div style={{ marginTop: '15px' }}>
              <h4>Threat Details:</h4>
              {detectionResults.currentThreat.details?.map((detail, index) => (
                <div key={index} className="metric">
                  <span>{detail.parameter}:</span>
                  <span>Z-Score: {detail.zScore.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ color: '#00ff88' }}>
            ✓ No active threats detected
          </div>
        )}
      </div>

      <div className="card">
        <h3>System Recommendations</h3>
        <div>
          {threatData?.recommendations?.map((rec, index) => (
            <div key={index} className="alert alert-warning">
              {rec}
            </div>
          )) || <p>System operating normally</p>}
        </div>
      </div>
    </div>
  );
};

export default ThreatAnalysis;