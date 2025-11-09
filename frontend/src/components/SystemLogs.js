import React, { useState, useEffect } from 'react';
import { getLogs } from '../services/api';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (filter === 'ALL') {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter(log => log.level === filter));
    }
  }, [logs, filter]);

  const fetchLogs = async () => {
    try {
      const data = await getLogs(100);
      setLogs(data.logs || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLoading(false);
    }
  };

  const getLogClass = (level) => {
    switch (level) {
      case 'ERROR': return 'error';
      case 'WARNING': return 'warning';
      default: return '';
    }
  };

  const getLogIcon = (level) => {
    switch (level) {
      case 'ERROR': return '❌';
      case 'WARNING': return '⚠️';
      case 'INFO': return 'ℹ️';
      default: return '📝';
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h3>📋 System Logs</h3>
        <div className="loading">Loading system logs</div>
      </div>
    );
  }

  return (
    <div className="card" data-testid="system-logs-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3>📋 System Logs</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: '13px' }}>Filter:</span>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ 
              background: 'rgba(0,0,0,0.3)', 
              color: 'white', 
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '8px 15px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
            data-testid="log-filter-select"
          >
            <option value="ALL">All Logs</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warnings</option>
            <option value="ERROR">Errors</option>
          </select>
          <span className="badge badge-info">{filteredLogs.length} entries</span>
        </div>
      </div>
      
      <div className="log-container" data-testid="log-entries-container">
        {filteredLogs.length === 0 ? (
          <div className="log-entry" style={{ textAlign: 'center', color: '#888' }}>
            No logs available for selected filter
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div key={index} className={`log-entry ${getLogClass(log.level)}`}>
              <span style={{ color: '#888', fontSize: '11px' }}>
                [{new Date(log.timestamp).toLocaleTimeString()}]
              </span>
              <span style={{ marginLeft: '10px' }}>
                {getLogIcon(log.level)}
              </span>
              <span style={{ color: '#00ff88', marginLeft: '5px', fontWeight: '600' }}>
                [{log.level}]
              </span>
              <span style={{ marginLeft: '10px', color: '#fff' }}>
                {log.message}
              </span>
              {log.details && (
                <div style={{ marginLeft: '20px', marginTop: '5px', fontSize: '11px', color: '#aaa' }}>
                  {typeof log.details === 'object' ? JSON.stringify(log.details, null, 2) : log.details}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          className="btn btn-primary" 
          onClick={fetchLogs}
          style={{ fontSize: '12px', padding: '8px 15px' }}
          data-testid="refresh-logs-btn"
        >
          🔄 Refresh Logs
        </button>
        <span style={{ fontSize: '11px', color: '#888' }}>
          Auto-refreshing every 5 seconds
        </span>
      </div>
    </div>
  );
};

export default SystemLogs;