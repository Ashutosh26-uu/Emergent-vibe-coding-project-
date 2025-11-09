import React, { useState, useEffect } from 'react';
import { exportThreats, getThreats, getMetrics } from '../services/api';

const ReportExporter = () => {
  const [threats, setThreats] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [threatsData, metricsData] = await Promise.all([
        getThreats(1000),
        getMetrics()
      ]);
      setThreats(threatsData.threats || []);
      setMetrics(metricsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await exportThreats(exportFormat);
      
      if (exportFormat === 'json') {
        // Download JSON
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `threat_report_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
      } else if (exportFormat === 'csv') {
        // Download CSV
        const blob = new Blob([data.csv_data], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `threat_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
      }
      
      alert('✓ Report exported successfully!');
    } catch (error) {
      alert('❌ Error exporting report: ' + error.message);
    }
    setExporting(false);
  };

  const generateSummaryReport = () => {
    const report = {
      generated_at: new Date().toISOString(),
      summary: {
        total_threats: metrics?.total_threats || 0,
        resolved_threats: metrics?.resolved_threats || 0,
        active_threats: metrics?.active_threats || 0,
        detection_rate: ((metrics?.detection_rate || 0) * 100).toFixed(1) + '%',
        false_positive_rate: ((metrics?.false_positive_rate || 0) * 100).toFixed(1) + '%'
      },
      threat_distribution: metrics?.threat_distribution || {},
      recent_threats: threats.slice(0, 10)
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary_report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  if (loading) {
    return <div className="loading">Loading report data</div>;
  }

  const resolvedCount = threats.filter(t => t.resolved).length;
  const criticalCount = threats.filter(t => t.severity === 'CRITICAL').length;

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="card" style={{ gridColumn: '1 / -1' }} data-testid="report-exporter-header">
        <h3>📄 Threat Report Exporter</h3>
        <p style={{ color: '#aaa', marginTop: '5px', fontSize: '13px' }}>
          Export comprehensive threat reports and analytics in multiple formats
        </p>
      </div>

      {/* Report Summary */}
      <div className="card" data-testid="report-summary-card">
        <h3>📊 Report Summary</h3>
        <div className="metric">
          <span>Total Threats Detected:</span>
          <span className="badge badge-info">{threats.length}</span>
        </div>
        <div className="metric">
          <span>Resolved Threats:</span>
          <span className="badge badge-success">{resolvedCount}</span>
        </div>
        <div className="metric">
          <span>Active Threats:</span>
          <span className="badge badge-danger">{threats.length - resolvedCount}</span>
        </div>
        <div className="metric">
          <span>Critical Incidents:</span>
          <span className="badge badge-danger">{criticalCount}</span>
        </div>
        <div className="metric">
          <span>Detection Accuracy:</span>
          <span>{((metrics?.detection_rate || 0) * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* Export Options */}
      <div className="card" data-testid="export-options-card">
        <h3>📥 Export Options</h3>
        
        <div className="form-group">
          <label>Select Export Format</label>
          <select 
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            data-testid="export-format-select"
          >
            <option value="json">JSON - Complete Data</option>
            <option value="csv">CSV - Spreadsheet Format</option>
          </select>
        </div>

        <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '5px' }}>
          <strong style={{ color: '#00d2d3' }}>Export Includes:</strong>
          <ul style={{ marginTop: '10px', fontSize: '13px', color: '#aaa', lineHeight: '1.8' }}>
            <li>✓ All threat detections with timestamps</li>
            <li>✓ Threat types and severity levels</li>
            <li>✓ Confidence scores and details</li>
            <li>✓ Resolution status and timelines</li>
            <li>✓ Vehicle IDs and affected systems</li>
          </ul>
        </div>

        <button 
          className="btn btn-success" 
          onClick={handleExport}
          disabled={exporting || threats.length === 0}
          style={{ marginTop: '15px', width: '100%' }}
          data-testid="export-full-report-btn"
        >
          {exporting ? '🔄 Exporting...' : `📥 Export Full Report (${exportFormat.toUpperCase()})`}
        </button>
      </div>

      {/* Quick Reports */}
      <div className="card" data-testid="quick-reports-card">
        <h3>⚡ Quick Reports</h3>
        <p style={{ color: '#aaa', marginBottom: '15px', fontSize: '13px' }}>
          Generate pre-configured reports instantly
        </p>
        
        <button 
          className="btn btn-primary" 
          onClick={generateSummaryReport}
          style={{ marginBottom: '10px', width: '100%' }}
          data-testid="export-summary-btn"
        >
          📄 Executive Summary
        </button>
        
        <button 
          className="btn btn-primary" 
          onClick={() => {
            const activeThreats = threats.filter(t => !t.resolved);
            const blob = new Blob([JSON.stringify(activeThreats, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `active_threats_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
          }}
          style={{ marginBottom: '10px', width: '100%' }}
          data-testid="export-active-threats-btn"
        >
          ⚠️ Active Threats Only
        </button>
        
        <button 
          className="btn btn-primary" 
          onClick={() => {
            const criticalThreats = threats.filter(t => t.severity === 'CRITICAL');
            const blob = new Blob([JSON.stringify(criticalThreats, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `critical_incidents_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
          }}
          style={{ width: '100%' }}
          data-testid="export-critical-incidents-btn"
        >
          ☢️ Critical Incidents
        </button>
      </div>

      {/* Recent Threats Preview */}
      <div className="card" style={{ gridColumn: '1 / -1' }} data-testid="recent-threats-preview">
        <h3>🔍 Recent Threats Preview</h3>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {threats.slice(0, 10).map((threat, index) => (
            <div 
              key={index} 
              className="metric" 
              style={{ padding: '12px', marginBottom: '8px' }}
            >
              <div>
                <strong>{threat.threat_type?.replace('_', ' ')}</strong>
                <br />
                <span style={{ fontSize: '11px', color: '#888' }}>
                  {new Date(threat.detected_at).toLocaleString()}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge badge-${threat.severity === 'CRITICAL' ? 'danger' : 'warning'}`}>
                  {threat.severity}
                </span>
                <br />
                <span style={{ fontSize: '11px', color: '#888' }}>
                  {threat.resolved ? '✓ Resolved' : '⚠️ Active'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="card" style={{ gridColumn: '1 / -1' }} data-testid="export-statistics-card">
        <h3>📊 Export Statistics</h3>
        <div className="grid-2">
          <div className="metric">
            <span>Available Records:</span>
            <span>{threats.length}</span>
          </div>
          <div className="metric">
            <span>Date Range:</span>
            <span style={{ fontSize: '11px' }}>
              {threats.length > 0 
                ? `${new Date(threats[threats.length - 1].detected_at).toLocaleDateString()} - ${new Date(threats[0].detected_at).toLocaleDateString()}`
                : 'N/A'
              }
            </span>
          </div>
          <div className="metric">
            <span>GPS Spoofing:</span>
            <span>{metrics?.threat_distribution?.gps_spoofing || 0}</span>
          </div>
          <div className="metric">
            <span>Control Hijacking:</span>
            <span>{metrics?.threat_distribution?.control_hijacking || 0}</span>
          </div>
          <div className="metric">
            <span>Data Tampering:</span>
            <span>{metrics?.threat_distribution?.data_tampering || 0}</span>
          </div>
          <div className="metric">
            <span>Anomalies:</span>
            <span>{metrics?.threat_distribution?.anomalies || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportExporter;