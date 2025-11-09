import React, { useState, useEffect } from 'react';

const SystemLogs = ({ logs }) => {
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (filter === 'ALL') {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter(log => log.level === filter));
    }
  }, [logs, filter]);

  const getLogClass = (level) => {
    switch (level) {
      case 'ERROR': return 'error';
      case 'WARNING': return 'warning';
      default: return '';
    }
  };

  return (
    <div className="card">
      <h3>System Logs</h3>
      <div style={{ marginBottom: '15px' }}>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ 
            background: 'rgba(0,0,0,0.3)', 
            color: 'white', 
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '5px 10px',
            borderRadius: '3px'
          }}
        >
          <option value="ALL">All Logs</option>
          <option value="INFO">Info</option>
          <option value="WARNING">Warnings</option>
          <option value="ERROR">Errors</option>
        </select>
      </div>
      <div className="log-container">
        {filteredLogs.length === 0 ? (
          <div className="log-entry">No logs available</div>
        ) : (
          filteredLogs.map((log, index) => (
            <div key={index} className={`log-entry ${getLogClass(log.level)}`}>
              <span style={{ color: '#888' }}>
                [{new Date(log.timestamp).toLocaleTimeString()}]
              </span>
              <span style={{ color: '#00ff88', marginLeft: '10px' }}>
                [{log.level}]
              </span>
              <span style={{ marginLeft: '10px' }}>
                {log.message}
              </span>
              {log.details && (
                <div style={{ marginLeft: '20px', fontSize: '11px', color: '#ccc' }}>
                  {JSON.stringify(log.details, null, 2)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SystemLogs;