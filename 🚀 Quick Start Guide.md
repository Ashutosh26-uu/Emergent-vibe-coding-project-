# 🚀 Quick Start Guide
## AI Cyber Defense Framework - Get Started in 2 Minutes!

---

## ⚡ Instant Access

### Open the Application
👉 *Frontend*: http://localhost:3000  
👉 *API Docs*: http://localhost:8001/docs

*All services are already running!* Just open the links above.

---

## 🎯 Try These Features First

### 1. Dashboard (Main Tab)
*What to do:*
1. Look at the *System Status* card - shows current threat level
2. Watch the *real-time monitoring graph* update every 3 seconds
3. Click any *attack simulation button*:
   - 🛰 *Simulate GPS Spoofing* - Tests location security
   - 🎮 *Simulate Control Hijacking* - Tests command security
   - 💾 *Simulate Data Tampering* - Tests sensor security
4. See the threat level change in real-time!
5. Click *Initiate Recovery* to resolve all threats

*What you'll see:*
- Threat level changes (LOW → CRITICAL)
- System health drops
- Alerts appear in the Recent Alerts section
- Graphs show real-time updates

---

### 2. Threat Analysis Tab
*What to do:*
1. Click the *"Threat Analysis"* tab
2. View the pie chart showing threat distribution
3. Check detection performance metrics
4. See active threats list

*What you'll see:*
- Visual breakdown of attack types
- Detection accuracy (95%)
- Active vs resolved threats
- System statistics

---

### 3. System Logs Tab
*What to do:*
1. Click the *"System Logs"* tab
2. Use the filter dropdown to see:
   - *All Logs* - Everything
   - *Info* - Normal operations
   - *Warnings* - Attack detections
   - *Errors* - Critical issues
3. Watch logs auto-refresh every 5 seconds

*What you'll see:*
- Timestamp for each event
- Log level (INFO/WARNING/ERROR)
- Detailed messages about system activities

---

### 4. Scenarios Tab (Create Custom Attacks)
*What to do:*
1. Click the *"Scenarios"* tab
2. Click *"+ Create Scenario"* button
3. Fill in:
   - *Name*: "My Custom Attack"
   - *Description*: "Testing GPS manipulation"
   - *Threat Type*: Select "GPS Spoofing"
   - *Parameters*: Keep the default JSON or modify
4. Click *"Save Scenario"*

*What you'll see:*
- Your custom scenario appears as a card
- Built-in scenarios are marked as "BUILT-IN"
- Custom scenarios show "CUSTOM" badge
- You can delete custom scenarios

---

### 5. ML Config Tab (Tune AI Detection)
*What to do:*
1. Click the *"ML Config"* tab
2. Try adjusting sliders:
   - *Anomaly Threshold*: Lower = more sensitive (move to 1.5)
   - *Speed Threshold*: Controls GPS validation
   - *Detection Sensitivity*: Choose Low/Medium/High
3. Toggle *Auto-Response* on/off
4. Click *"Save Configuration"*

*What you'll see:*
- Real-time updates to detection parameters
- Success message when saved
- Current settings displayed clearly

---

### 6. Reports Tab (Export Data)
*What to do:*
1. Click the *"Reports"* tab
2. Choose export format: *JSON* or *CSV*
3. Click *"Export Full Report"*
4. File downloads automatically!

*Quick Reports:*
- *Executive Summary* - High-level overview
- *Active Threats Only* - Current threats
- *Critical Incidents* - Only critical threats

*What you'll see:*
- Report summary with statistics
- Recent threats preview
- Export statistics

---

## 🧪 Quick API Test

### Try These Commands in Terminal

*1. Check System Health:*
bash
curl http://localhost:8001/api/health


*2. Get System Status:*
bash
curl http://localhost:8001/api/monitoring/status | python -m json.tool


*3. Simulate a GPS Attack:*
bash
curl -X POST "http://localhost:8001/api/attacks/simulate/GPS_SPOOFING?vehicle_id=drone-001"


*4. View All Threats:*
bash
curl http://localhost:8001/api/threats | python -m json.tool


*5. Get Performance Metrics:*
bash
curl http://localhost:8001/api/metrics | python -m json.tool


*6. Initiate System Recovery:*
bash
curl -X POST http://localhost:8001/api/recovery/initiate | python -m json.tool


---

## 🎮 Complete Demo Flow (5 Minutes)

### Step 1: Start Fresh (30 seconds)
1. Open http://localhost:3000
2. Go to Dashboard
3. Click *"Initiate Recovery"* to clear any existing threats
4. Watch system health return to 100%

### Step 2: Simulate Attacks (2 minutes)
1. Click *"Simulate GPS Spoofing"* button
   - Watch threat level change
   - See alert appear
   - Notice system health drop
2. Click *"Simulate Control Hijacking"* button
   - Another alert appears
   - Threat level increases
3. Click *"Simulate Data Tampering"* button
   - System health drops further
   - Multiple alerts now visible

### Step 3: Analyze Threats (1 minute)
1. Switch to *"Threat Analysis"* tab
2. View the pie chart - see all 3 attack types
3. Check the active threats list
4. Note the detection metrics

### Step 4: Check Logs (1 minute)
1. Switch to *"System Logs"* tab
2. Filter by *"WARNING"* to see attacks
3. See timestamps and details
4. Notice automatic logging of all events

### Step 5: Export Report (30 seconds)
1. Switch to *"Reports"* tab
2. Select *JSON* format
3. Click *"Export Full Report"*
4. Open downloaded file to see all threat data

### Step 6: Recover System (30 seconds)
1. Go back to *"Dashboard"* tab
2. Click *"Initiate Recovery"*
3. Watch threats resolve
4. System health returns to 100%
5. Threat level drops to LOW

---

## 📊 Understanding the UI

### Color Codes
- 🟢 *Green (LOW)*: System secure, no threats
- 🟡 *Yellow (MEDIUM)*: Minor threats detected
- 🟠 *Orange (HIGH)*: Significant threats detected
- 🔴 *Red (CRITICAL)*: Critical threats, action needed

### Status Indicators
- *System Health*: 100% = Perfect, <70% = Concerning
- *Active Threats*: Number of unresolved threats
- *Threat Level*: Overall security status

### Auto-Refresh
- Dashboard updates every *3 seconds*
- Threat Analysis updates every *10 seconds*
- System Logs update every *5 seconds*

---

## 🔧 Troubleshooting

### "Cannot connect to backend"
bash
# Check if backend is running
sudo supervisorctl status backend

# Restart backend if needed
sudo supervisorctl restart backend


### "No data showing"
bash
# Simulate an attack to generate data
curl -X POST "http://localhost:8001/api/attacks/simulate/GPS_SPOOFING?vehicle_id=drone-001"


### "Frontend not loading"
bash
# Check frontend status
sudo supervisorctl status frontend

# Restart frontend
sudo supervisorctl restart frontend


---

## 🎯 Common Use Cases

### For Demos/Presentations
1. Start with clean system (Initiate Recovery)
2. Explain the dashboard features
3. Simulate 2-3 different attacks
4. Show threat analysis and metrics
5. Demonstrate recovery capability

### For Testing
1. Adjust ML Config thresholds
2. Create custom scenarios
3. Run attack simulations
4. Analyze detection performance
5. Export results for review

### For Learning
1. Read through System Logs to understand events
2. Experiment with different ML configurations
3. Create and test custom attack scenarios
4. Study the API documentation
5. Export data to analyze patterns

---

## 📚 Next Steps

### Want More Details?
- *Complete Guide*: /app/README.md
- *Feature Details*: /app/USAGE_GUIDE.md
- *Deployment Info*: /app/DEPLOYMENT_REPORT.md

### Explore API
- *Interactive Docs*: http://localhost:8001/docs
- *ReDoc*: http://localhost:8001/redoc

### Advanced Usage
- Create custom attack scenarios
- Fine-tune ML parameters
- Build integrations via REST API
- Export and analyze threat data

---

## 🏆 Key Takeaways

✅ *6 Powerful Tabs*: Dashboard, Analysis, Logs, Scenarios, ML Config, Reports  
✅ *Real-time Monitoring*: Live updates every few seconds  
✅ *3 Attack Types*: GPS, Control, Data tampering  
✅ *AI Detection*: 95% accuracy with configurable thresholds  
✅ *Export Capability*: JSON/CSV report generation  
✅ *Auto-Recovery*: One-click threat resolution  

---

## 🎉 You're All Set!

*Start exploring now:* http://localhost:3000

*Questions?* Check the full documentation in /app/README.md

🛡 *Happy Defending!* 🚀
