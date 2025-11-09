import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import ThreatAnalysis from './components/ThreatAnalysis';
import SystemLogs from './components/SystemLogs';
import ScenarioBuilder from './components/ScenarioBuilder';
import MLConfiguration from './components/MLConfiguration';
import ReportExporter from './components/ReportExporter';
import { 
  getSystemStatus, 
  simulateAttack, 
  initiateRecovery,
  getThreats 
} from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [systemData, setSystemData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  useEffect(() => {
    // Initial data fetch
    fetchSystemData();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchSystemData, 3000); // Update every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchSystemData = async () => {
    try {
      const [statusData, threatsData] = await Promise.all([
        getSystemStatus(),
        getThreats(5, false)
      ]);
      
      setSystemData({
        ...statusData,
        recent_threats: threatsData.threats || []
      });
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Error fetching system data:', error);
      setConnectionStatus('error');
    }
  };

  const handleSimulateAttack = async (attackType) => {
    setLoading(true);
    try {
      await simulateAttack(attackType);
      // Refresh data after simulation
      setTimeout(fetchSystemData, 500);
    } catch (error) {
      alert('Error simulating attack: ' + error.message);
    }
    setLoading(false);
  };

  const handleInitiateRecovery = async () => {
    setLoading(true);
    try {
      const result = await initiateRecovery();
      alert(`✓ Recovery initiated successfully! ${result.threats_resolved} threats resolved.`);
      setTimeout(fetchSystemData, 500);
    } catch (error) {
      alert('Error initiating recovery: ' + error.message);
    }
    setLoading(false);
  };

  const getConnectionStatusBadge = () => {
    const statuses = {
      checking: { text: 'Connecting...', color: '#888', icon: '🔄' },
      connected: { text: 'Connected', color: '#00ff88', icon: '✓' },
      error: { text: 'Connection Error', color: '#ff4444', icon: '❌' }
    };
    const status = statuses[connectionStatus];
    return (
      <span style={{ 
        color: status.color, 
        fontSize: '12px',
        padding: '5px 10px',
        background: `${status.color}20`,
        borderRadius: '5px'
      }}>
        {status.icon} {status.text}
      </span>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            systemData={systemData}
            onSimulateAttack={handleSimulateAttack}
            onInitiateRecovery={handleInitiateRecovery}
            loading={loading}
          />
        );
      case 'analysis':
        return <ThreatAnalysis />;
      case 'logs':
        return <SystemLogs />;
      case 'scenarios':
        return <ScenarioBuilder />;
      case 'ml-config':
        return <MLConfiguration />;
      case 'reports':
        return <ReportExporter />;
      default:
        return <Dashboard systemData={systemData} />;
    }
  };

  return (
    <div className="app" data-testid="app-container">
      {/* Header */}
      <div className="header" data-testid="app-header">
        <h1>🛡️ AI Cyber Defense Framework</h1>
        <p>Real-time Protection for Autonomous Systems</p>
        <div style={{ marginTop: '10px' }}>
          {getConnectionStatusBadge()}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs" data-testid="navigation-tabs">
        <button 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          data-testid="dashboard-tab"
        >
          📊 Dashboard
        </button>
        <button 
          className={`nav-tab ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
          data-testid="analysis-tab"
        >
          🔍 Threat Analysis
        </button>
        <button 
          className={`nav-tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
          data-testid="logs-tab"
        >
          📋 System Logs
        </button>
        <button 
          className={`nav-tab ${activeTab === 'scenarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('scenarios')}
          data-testid="scenarios-tab"
        >
          🎯 Scenarios
        </button>
        <button 
          className={`nav-tab ${activeTab === 'ml-config' ? 'active' : ''}`}
          onClick={() => setActiveTab('ml-config')}
          data-testid="ml-config-tab"
        >
          ⚙️ ML Config
        </button>
        <button 
          className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
          data-testid="reports-tab"
        >
          📄 Reports
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content" data-testid="main-content">
        {renderContent()}
      </div>

      {/* Footer */}
      <div className="footer" data-testid="app-footer">
        <p>
          🔒 AI-Powered Cybersecurity | 
          🚀 Autonomous Vehicle Protection | 
          🎯 Built for Innovation
        </p>
        <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
          Real-time threat detection and autonomous defense system
        </p>
      </div>
    </div>
  );
}

export default App;