# AI Cyber Defense Framework for Autonomous Systems

A React-based cybersecurity system that protects autonomous vehicles from data tampering, GPS spoofing, and control hijacking in real time.

## 🚀 Features

### Core Defense Capabilities
- **Intrusion Detection**: Unsupervised anomaly detection using statistical analysis
- **GPS Spoofing Protection**: Real-time GPS data validation and impossible movement detection
- **Control Integrity Verification**: Command authentication and checksum validation
- **Auto-Failover System**: Autonomous recovery and emergency protocols

### AI-Powered Detection
- **Statistical Anomaly Detection**: Z-score based analysis with configurable thresholds
- **Pattern Recognition**: Identifies subtle deviations from normal operational patterns
- **Real-time Monitoring**: Continuous system health and threat assessment
- **Adaptive Learning**: Baseline establishment from normal operational data

### Attack Simulation
- **GPS Spoofing Simulation**: Inject impossible coordinates and altitude data
- **Control Hijacking**: Simulate unauthorized command injection
- **Data Tampering**: Corrupt sensor readings and system parameters
- **Performance Metrics**: Track detection accuracy, precision, and recall

## 🛠️ Installation

1. **Clone and Setup**
   ```bash
   cd ai-cyber-defense
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Access Dashboard**
   - Open http://localhost:3000
   - The system will automatically initialize with baseline training data

## 📊 System Architecture

### Services Layer
- **AnomalyDetector.js**: Core ML-based threat detection
- **DefenseSystem.js**: Automated response and countermeasures
- **SimulationEngine.js**: Attack scenario generation and testing

### Components Layer
- **Dashboard.js**: Real-time monitoring and control interface
- **ThreatAnalysis.js**: Visualization and performance metrics
- **SystemLogs.js**: Comprehensive activity logging

## 🔒 Security Features

### Threat Detection
- **GPS Spoofing**: Validates coordinate consistency and movement physics
- **Control Hijacking**: Verifies command sources and integrity checksums
- **Data Tampering**: Monitors sensor readings for impossible values
- **Anomaly Detection**: Statistical analysis of operational parameters

### Automated Response
- **Emergency Protocols**: Automatic failover to safe operational modes
- **System Isolation**: Disconnect compromised components
- **Recovery Procedures**: Guided restoration of normal operations
- **Alert Management**: Real-time notifications and threat classification

## 🎯 Use Cases

### Autonomous Vehicles
- Drone fleet protection
- Autonomous rover security
- UAV mission integrity
- Remote vehicle monitoring

### Defense Applications
- Military autonomous systems
- Critical infrastructure protection
- Surveillance platform security
- Emergency response coordination

## 📈 Performance Metrics

The system tracks and displays:
- **Detection Accuracy**: True/false positive rates
- **Response Time**: Threat identification to mitigation
- **System Health**: Overall operational status
- **Threat Distribution**: Attack type frequency analysis

## 🚨 Demo Scenarios

### GPS Spoofing Attack
```javascript
// Simulates impossible GPS coordinates
simulateGPSSpoofing() {
  return {
    latitude: 0, longitude: 0,
    altitude: -1000, // Impossible altitude
    speed: 500 // Impossible speed
  };
}
```

### Control Hijacking
```javascript
// Simulates unauthorized commands
simulateControlHijacking() {
  return {
    commands: [0xFF, 0xEE, 0xDD, 0xCC],
    source: 'UNKNOWN_SOURCE',
    checksum: 99 // Invalid checksum
  };
}
```

## 🔧 Configuration

### Detection Thresholds
- Anomaly detection sensitivity: `threshold = 2.5`
- GPS validation tolerance: `50 m/s speed difference`
- Control command timeout: `5 seconds`

### System Parameters
- Data buffer size: `50 samples`
- Monitoring interval: `2 seconds`
- Log retention: `100 entries`

## 🏆 Innovation Highlights

1. **Real-time AI Protection**: Continuous threat monitoring without human intervention
2. **Multi-vector Defense**: Simultaneous protection against multiple attack types
3. **Autonomous Recovery**: Self-healing capabilities with minimal downtime
4. **Simulation Framework**: Built-in testing and validation environment
5. **Scalable Architecture**: Modular design for easy extension and customization

## 🎪 Perfect for Hackathons

- **Quick Setup**: Ready to run in minutes
- **Visual Impact**: Real-time dashboards and threat visualization
- **Demo-Friendly**: Built-in attack simulations for presentations
- **Extensible**: Easy to add new threat types and countermeasures
- **Educational**: Clear separation of AI, security, and autonomy concepts

## 📝 Future Enhancements

- Machine learning model training interface
- Network-based attack detection
- Blockchain-based command verification
- Integration with real autonomous vehicle APIs
- Advanced visualization and 3D threat mapping

---

**Built for Innovation** | **Designed for Defense** | **Ready for Demo**
