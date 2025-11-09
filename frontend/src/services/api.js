import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health Check
export const checkHealth = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

// Monitoring
export const getSystemStatus = async () => {
  const response = await api.get('/api/monitoring/status');
  return response.data;
};

export const processTelemetry = async (telemetryData) => {
  const response = await api.post('/api/monitoring/telemetry', telemetryData);
  return response.data;
};

// Attacks
export const simulateAttack = async (attackType, vehicleId = 'drone-001') => {
  const response = await api.post(`/api/attacks/simulate/${attackType}?vehicle_id=${vehicleId}`);
  return response.data;
};

// Threats
export const getThreats = async (limit = 50, resolved = null) => {
  const params = { limit };
  if (resolved !== null) params.resolved = resolved;
  const response = await api.get('/api/threats', { params });
  return response.data;
};

export const resolveThreat = async (threatId) => {
  const response = await api.put(`/api/threats/${threatId}/resolve`);
  return response.data;
};

export const exportThreats = async (format = 'json') => {
  const response = await api.get('/api/threats/export', { params: { format } });
  return response.data;
};

// Scenarios
export const getScenarios = async () => {
  const response = await api.get('/api/scenarios');
  return response.data;
};

export const createScenario = async (scenarioData) => {
  const response = await api.post('/api/scenarios', scenarioData);
  return response.data;
};

export const deleteScenario = async (scenarioId) => {
  const response = await api.delete(`/api/scenarios/${scenarioId}`);
  return response.data;
};

// ML Configuration
export const getMLConfig = async () => {
  const response = await api.get('/api/ml-config');
  return response.data;
};

export const updateMLConfig = async (configData) => {
  const response = await api.put('/api/ml-config', configData);
  return response.data;
};

// Logs
export const getLogs = async (limit = 100, level = null) => {
  const params = { limit };
  if (level) params.level = level;
  const response = await api.get('/api/logs', { params });
  return response.data;
};

// Recovery
export const initiateRecovery = async () => {
  const response = await api.post('/api/recovery/initiate');
  return response.data;
};

// Metrics
export const getMetrics = async () => {
  const response = await api.get('/api/metrics');
  return response.data;
};

// Vehicles
export const getVehicles = async () => {
  const response = await api.get('/api/vehicles');
  return response.data;
};

export const createVehicle = async (vehicleData) => {
  const response = await api.post('/api/vehicles', vehicleData);
  return response.data;
};

export default api;