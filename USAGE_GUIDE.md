# 🚀 Usage Guide - AI Cyber Defense Framework

## Getting Started

### Quick Start Commands

```bash
# Check if services are running
sudo supervisorctl status

# Restart all services
sudo supervisorctl restart all

# View backend logs
tail -f /var/log/supervisor/backend.err.log

# View frontend logs
tail -f /var/log/supervisor/frontend.err.log
```

### Accessing the Application

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs

## Feature Guide

### 1. Dashboard Tab 📊

**Purpose**: Real-time monitoring and attack simulation

**Actions**:
1. View current system status and threat level
2. Monitor real-time graphs showing threats and system health
3. Simulate attacks using the buttons:
   - 🛰️ **GPS Spoofing** - Tests GPS validation
   - 🎮 **Control Hijacking** - Tests command authentication
   - 💾 **Data Tampering** - Tests sensor integrity
4. Click **Initiate Recovery** to resolve all active threats

**Tips**:
- Watch the graphs update in real-time
- System health decreases with active threats
- Threat level escalates based on severity

### 2. Threat Analysis Tab 🔍

**Purpose**: Detailed threat analysis and performance metrics

**Features**:
- **Threat Distribution Chart**: Pie chart showing attack types
- **Detection Performance**: Accuracy and false positive rates
- **Active Threats List**: Real-time threat monitoring
- **System Statistics**: Comprehensive metrics

**Tips**:
- Auto-refreshes every 10 seconds
- Shows resolution rate and success metrics
- Displays confidence scores for each threat

### 3. System Logs Tab 📋

**Purpose**: View detailed system activity logs

**Actions**:
1. Filter logs by level: ALL, INFO, WARNING, ERROR
2. View timestamps and detailed messages
3. Click **Refresh Logs** for manual update
4. Auto-refreshes every 5 seconds

**Tips**:
- Use filters to focus on specific log types
- ERROR logs show critical issues
- WARNING logs indicate potential threats

### 4. Scenarios Tab 🎯

**Purpose**: Create and manage custom attack scenarios

**Actions**:

**To Create a New Scenario**:
1. Click **+ Create Scenario**
2. Fill in the form:
   - **Name**: Descriptive scenario name
   - **Description**: What the scenario tests
   - **Threat Type**: Select from dropdown
   - **Parameters**: JSON configuration
3. Click **Save Scenario**

**Example Parameters**:

GPS Spoofing:
```json
{
  "altitude": -1000,
  "speed": 500,
  "latitude": 0,
  "longitude": 0
}
```

Control Hijacking:
```json
{
  "source": "UNKNOWN_SOURCE",
  "invalid_checksum": true
}
```

Data Tampering:
```json
{
  "sensor_corruption": true,
  "corruption_level": 0.8
}
```

**To Delete a Scenario**:
- Click **Delete Scenario** on custom scenarios only
- Built-in scenarios cannot be deleted

### 5. ML Config Tab ⚙️

**Purpose**: Fine-tune AI detection parameters

**Configurable Settings**:

**Anomaly Detection**:
- **Threshold (1.0-5.0)**: Lower = more sensitive
  - 1.5: High sensitivity (more false alarms)
  - 2.5: Balanced (default)
  - 4.0: Low sensitivity (fewer false alarms)
- **Window Size (10-200)**: Samples for analysis

**GPS Protection**:
- **Speed Threshold (10-200 m/s)**: Maximum speed change allowed
  - Default: 50 m/s
  - Higher = more tolerant

**Detection Sensitivity**:
- **Low**: Conservative, fewer false alarms
- **Medium**: Balanced (recommended)
- **High**: Aggressive, maximum detection

**Auto-Response**:
- Enable/Disable automated countermeasures
- When enabled: automatic failover on critical threats

**Actions**:
1. Adjust sliders or dropdowns
2. Click **Save Configuration**
3. Click **Reset to Defaults** to restore
4. Click **Refresh** to reload from server

### 6. Reports Tab 📄

**Purpose**: Export threat data and generate reports

**Export Options**:

**Full Report**:
1. Select format: JSON or CSV
2. Click **Export Full Report**
3. File downloads automatically
4. Contains all threats with full details

**Quick Reports**:
- **Executive Summary**: High-level overview with metrics
- **Active Threats Only**: Current active threats
- **Critical Incidents**: Only CRITICAL severity threats

**Report Contents**:
- Threat types and severity
- Detection timestamps
- Confidence scores
- Vehicle IDs
- Resolution status
- Full details and parameters

## API Usage Examples

### Test Attack Simulation

```bash
# GPS Spoofing
curl -X POST "http://localhost:8001/api/attacks/simulate/GPS_SPOOFING?vehicle_id=drone-001"

# Control Hijacking
curl -X POST "http://localhost:8001/api/attacks/simulate/CONTROL_HIJACKING?vehicle_id=drone-002"

# Data Tampering
curl -X POST "http://localhost:8001/api/attacks/simulate/DATA_TAMPERING?vehicle_id=drone-003"
```

### Get System Status

```bash
curl "http://localhost:8001/api/monitoring/status"
```

### List Active Threats

```bash
curl "http://localhost:8001/api/threats?resolved=false"
```

### Get Performance Metrics

```bash
curl "http://localhost:8001/api/metrics"
```

### Initiate Recovery

```bash
curl -X POST "http://localhost:8001/api/recovery/initiate"
```

### Export Threats

```bash
# JSON format
curl "http://localhost:8001/api/threats/export?format=json" > threats.json

# CSV format
curl "http://localhost:8001/api/threats/export?format=csv" > threats.csv
```

## Common Workflows

### Testing the Defense System

1. **Start Fresh**:
   ```bash
   curl -X POST "http://localhost:8001/api/recovery/initiate"
   ```

2. **Simulate Attack**:
   - Go to Dashboard tab
   - Click attack simulation button
   - Watch system respond

3. **Analyze Results**:
   - Switch to Threat Analysis tab
   - Review detection metrics
   - Check system logs

4. **Review Configuration**:
   - Go to ML Config tab
   - Adjust thresholds if needed
   - Test again

### Creating Custom Scenarios

1. Go to **Scenarios** tab
2. Click **+ Create Scenario**
3. Choose threat type
4. Modify parameters JSON
5. Save and test
6. Run via Dashboard or API

### Monitoring Fleet

1. **Dashboard** tab shows:
   - Active vehicles count
   - Per-vehicle threat status
   
2. **Check specific vehicle**:
   ```bash
   curl "http://localhost:8001/api/threats?vehicle_id=drone-001"
   ```

### Generating Reports

1. Run some attack simulations
2. Go to **Reports** tab
3. Select desired report type
4. Choose format (JSON/CSV)
5. Click export
6. File downloads automatically

## Troubleshooting

### Backend Not Running

```bash
# Check logs
tail -50 /var/log/supervisor/backend.err.log

# Restart
sudo supervisorctl restart backend
```

### Frontend Not Loading

```bash
# Check logs
tail -50 /var/log/supervisor/frontend.err.log

# Restart
sudo supervisorctl restart frontend

# Check if port 3000 is accessible
curl http://localhost:3000
```

### MongoDB Connection Issues

```bash
# Check MongoDB is running
pgrep mongod

# View MongoDB logs
tail -50 /var/log/supervisor/mongodb.err.log
```

### API Connection Failed

1. Verify backend is running: `sudo supervisorctl status backend`
2. Test API endpoint: `curl http://localhost:8001/api/health`
3. Check frontend .env has correct REACT_APP_BACKEND_URL

## Performance Tips

1. **Optimal Settings for Demo**:
   - Anomaly Threshold: 2.5
   - Detection Sensitivity: Medium
   - Auto-response: Enabled

2. **For Maximum Detection**:
   - Anomaly Threshold: 1.5
   - Detection Sensitivity: High
   - Window Size: 30

3. **For Minimum False Alarms**:
   - Anomaly Threshold: 3.5
   - Detection Sensitivity: Low
   - Window Size: 100

## Best Practices

1. **Regular Monitoring**: Check Dashboard frequently during demos
2. **Clear Threats**: Use Recovery before new demonstrations
3. **Export Reports**: Save threat data before clearing
4. **Adjust ML Config**: Tune based on your use case
5. **Test Scenarios**: Validate custom scenarios before demos

## Keyboard Shortcuts

- Ctrl+R: Refresh browser
- F12: Open browser developer tools
- Ctrl+Shift+I: Inspect elements

## Additional Resources

- **API Documentation**: http://localhost:8001/docs
- **Interactive API**: http://localhost:8001/redoc
- **Source Code**: /app/backend and /app/frontend
- **Logs Directory**: /var/log/supervisor/

---

**Happy Testing! 🛡️ Stay Secure! 🚀**
