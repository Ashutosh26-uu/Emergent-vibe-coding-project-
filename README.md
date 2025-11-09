# 🛡️ AI Cyber Defense Framework for Autonomous Systems

A comprehensive, full-stack AI-powered cybersecurity system designed to protect autonomous vehicles (drones, rovers, UAVs) from cyber attacks including GPS spoofing, control hijacking, and data tampering in real-time.

## 🌟 Key Features

### 🔒 Core Defense Capabilities
- **Real-time Threat Detection**: AI-powered anomaly detection using statistical analysis
- **GPS Spoofing Protection**: Validates GPS coordinates and detects impossible movements
- **Control Integrity Verification**: Command authentication and checksum validation
- **Data Tampering Detection**: Monitors sensor readings for corruption
- **Auto-Failover System**: Autonomous recovery and emergency protocols
- **Multi-vector Defense**: Simultaneous protection against multiple attack types

### 🤖 AI-Powered Detection
- **Unsupervised Anomaly Detection**: Z-score based statistical analysis
- **Pattern Recognition**: Identifies subtle deviations from normal operations
- **Configurable Thresholds**: Adjustable sensitivity levels (Low/Medium/High)
- **Adaptive Learning**: Baseline establishment from normal operational data
- **Real-time Monitoring**: Continuous system health and threat assessment

### 🎯 Advanced Features
- **Custom Attack Scenarios**: Build and test custom threat scenarios
- **ML Configuration Panel**: Fine-tune detection parameters and thresholds
- **Report Exporter**: Export threat reports in JSON/CSV formats
- **Vehicle Fleet Management**: Monitor multiple autonomous vehicles
- **Comprehensive Logging**: Detailed system activity logs with filtering
- **Performance Metrics**: Track detection accuracy, precision, and recall

## 🏗️ Architecture

### Technology Stack
- **Backend**: FastAPI (Python) - High-performance async API
- **Frontend**: React 18 - Modern, responsive UI
- **Database**: MongoDB - Persistent data storage
- **ML/AI**: NumPy, Scikit-learn - Statistical analysis
- **Visualization**: Recharts - Real-time charts and graphs

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────┬──────────┬──────────┬──────────────────┐  │
│  │Dashboard │ Analysis │   Logs   │  Configuration   │  │
│  └──────────┴──────────┴──────────┴──────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           ↕ REST API
┌─────────────────────────────────────────────────────────┐
│                   Backend (FastAPI)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Anomaly Detector │ Defense System │ Simulator   │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│                    MongoDB Database                      │
│  Threats | Logs | Scenarios | Metrics | ML Config       │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 16+ & Yarn
- MongoDB (running)

### Installation & Setup

1. **Clone and Navigate**
   ```bash
   cd /app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   yarn install
   ```

4. **Start Services**
   ```bash
   # Start both services using supervisor
   sudo supervisorctl restart all
   
   # Or manually:
   # Terminal 1 - Backend
   cd /app/backend && python server.py
   
   # Terminal 2 - Frontend
   cd /app/frontend && yarn start
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8001
   - API Documentation: http://localhost:8001/docs

## 📊 Features Walkthrough

### 1. Dashboard 📈
Real-time monitoring and attack simulation interface
- **System Status**: Current threat level and system health
- **Live Charts**: Real-time monitoring graphs
- **Attack Simulation**: Test GPS spoofing, control hijacking, data tampering
- **Recent Alerts**: Latest threat detections
- **Recovery Controls**: One-click system recovery

### 2. Threat Analysis 🔍
Comprehensive threat analysis and performance metrics
- **Threat Distribution**: Visual breakdown of attack types
- **Detection Performance**: Accuracy, precision, recall metrics
- **Active Threats**: Real-time threat monitoring
- **System Statistics**: Historical data and trends

### 3. System Logs 📋
Detailed activity logging with advanced filtering
- **Real-time Logs**: Auto-refreshing log stream
- **Log Filtering**: Filter by INFO/WARNING/ERROR levels
- **Detailed Information**: Timestamps, severity, and details
- **Export Capability**: Save logs for analysis

### 4. Scenario Builder 🎯
Create and manage custom attack scenarios
- **Built-in Scenarios**: GPS Spoofing, Control Hijacking, Data Tampering
- **Custom Scenarios**: Define your own attack parameters
- **JSON Configuration**: Flexible parameter definition
- **Scenario Management**: Create, view, delete scenarios

### 5. ML Configuration ⚙️
Fine-tune AI detection parameters
- **Anomaly Threshold**: Adjust Z-score sensitivity (1.0-5.0)
- **GPS Protection**: Configure speed and altitude thresholds
- **Detection Sensitivity**: Low/Medium/High presets
- **Auto-Response**: Enable/disable automated countermeasures
- **Data Window Size**: Configure analysis sample size

### 6. Report Exporter 📄
Export comprehensive threat reports
- **Full Reports**: Export all threats in JSON/CSV
- **Quick Reports**: Executive summary, active threats, critical incidents
- **Statistics**: Detection rates, threat distribution
- **Date Ranges**: Historical data export

## 🔌 API Endpoints

### Monitoring
- `GET /api/health` - Health check
- `GET /api/monitoring/status` - System status
- `POST /api/monitoring/telemetry` - Process telemetry data

### Attacks & Threats
- `POST /api/attacks/simulate/{attack_type}` - Simulate attacks
- `GET /api/threats` - List threats
- `PUT /api/threats/{threat_id}/resolve` - Resolve threat
- `GET /api/threats/export` - Export threat reports

### Scenarios
- `GET /api/scenarios` - List scenarios
- `POST /api/scenarios` - Create custom scenario
- `DELETE /api/scenarios/{scenario_id}` - Delete scenario

### ML Configuration
- `GET /api/ml-config` - Get ML configuration
- `PUT /api/ml-config` - Update ML configuration

### System
- `GET /api/logs` - Get system logs
- `POST /api/recovery/initiate` - Initiate recovery
- `GET /api/metrics` - Get performance metrics
- `GET /api/vehicles` - List vehicles

## 🎪 Demo Scenarios

### GPS Spoofing Attack
```bash
curl -X POST "http://localhost:8001/api/attacks/simulate/GPS_SPOOFING?vehicle_id=drone-001"
```
Simulates impossible GPS coordinates (latitude: 0, longitude: 0, altitude: -1000m)

### Control Hijacking
```bash
curl -X POST "http://localhost:8001/api/attacks/simulate/CONTROL_HIJACKING?vehicle_id=drone-001"
```
Simulates unauthorized command injection with invalid checksums

### Data Tampering
```bash
curl -X POST "http://localhost:8001/api/attacks/simulate/DATA_TAMPERING?vehicle_id=drone-001"
```
Simulates sensor data corruption with impossible values

## 🔧 Configuration

### Backend Configuration (.env)
```env
MONGO_URL=mongodb://localhost:27017/
DATABASE_NAME=cyber_defense_db
```

### Frontend Configuration (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### ML Detection Parameters
```python
{
  "anomaly_threshold": 2.5,        # Z-score threshold
  "gps_speed_threshold": 50.0,     # m/s
  "data_window_size": 50,          # samples
  "detection_sensitivity": "medium",
  "auto_response_enabled": true
}
```

## 📈 Detection Algorithms

### Anomaly Detection
Uses Z-score statistical analysis:
```
z_score = |value - mean| / std_deviation
is_anomaly = z_score > threshold
```

### GPS Spoofing Detection
- Altitude validation: -500m to 50,000m
- Speed change threshold: 50 m/s
- Coordinate consistency checks
- Impossible movement detection

### Control Hijacking Detection
- Command source authentication
- Checksum validation
- Authorized source verification
- Command integrity checks

## 🏆 Use Cases

### Autonomous Vehicles
- Drone fleet protection
- Autonomous rover security
- UAV mission integrity
- Self-driving vehicle security

### Defense Applications
- Military autonomous systems
- Critical infrastructure protection
- Surveillance platform security
- Emergency response coordination

### Research & Development
- Cybersecurity testing
- AI/ML model training
- Threat simulation research
- Security protocol development

## 🎯 Perfect for Hackathons

- ✅ **Quick Setup**: Ready to run in minutes
- ✅ **Visual Impact**: Real-time dashboards and visualizations
- ✅ **Demo-Friendly**: Built-in attack simulations
- ✅ **Extensible**: Easy to add new features
- ✅ **Educational**: Clear separation of concepts
- ✅ **Full-Stack**: Complete end-to-end solution

## 📝 MongoDB Collections

### threats
Stores detected threats and alerts
```json
{
  "threat_id": "uuid",
  "threat_type": "GPS_SPOOFING",
  "severity": "CRITICAL",
  "confidence": 0.99,
  "detected_at": "timestamp",
  "vehicle_id": "drone-001",
  "details": {},
  "resolved": false
}
```

### scenarios
Attack scenario definitions
```json
{
  "scenario_id": "uuid",
  "name": "Custom Attack",
  "description": "...",
  "threat_type": "GPS_SPOOFING",
  "parameters": {},
  "is_custom": true
}
```

### ml_config
ML model configuration
```json
{
  "config_id": "uuid",
  "anomaly_threshold": 2.5,
  "gps_speed_threshold": 50.0,
  "detection_sensitivity": "medium",
  "auto_response_enabled": true
}
```

## 🔒 Security Features

### Threat Detection
- Real-time statistical anomaly detection
- GPS coordinate validation
- Command authentication
- Data integrity checks
- Multi-layer defense strategy

### Automated Response
- Emergency protocol activation
- System isolation
- Failover mode engagement
- Automatic threat containment
- Recovery procedures

## 🚧 Future Enhancements

- [ ] WebSocket for real-time updates
- [ ] Advanced ML models (LSTM, Transformers)
- [ ] Network-based attack detection
- [ ] Blockchain command verification
- [ ] 3D threat visualization
- [ ] Integration with real vehicle APIs
- [ ] Multi-user authentication
- [ ] Threat prediction algorithms

## 📞 Support & Documentation

- **API Docs**: http://localhost:8001/docs
- **Frontend**: http://localhost:3000
- **Logs**: `/var/log/supervisor/backend.*.log` and `/var/log/supervisor/frontend.*.log`

## 🎖️ Project Highlights

✨ **Innovation**: Unique blend of AI + Cybersecurity + Autonomous Systems
✨ **Practical**: Software-only simulation, no hardware required
✨ **Scalable**: Modular architecture for easy extension
✨ **Production-Ready**: Full-stack with persistent storage
✨ **Real-time**: Live monitoring and instant threat response
✨ **Comprehensive**: End-to-end solution with all features

---

**Built with ❤️ for Innovation** | **Designed for Defense** | **Ready for Demo** | **Perfect for Hackathons**

🛡️ **Protecting Autonomous Systems with AI-Powered Cybersecurity** 🤖
