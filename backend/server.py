from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import os
import numpy as np
from sklearn.preprocessing import StandardScaler
import json
import uuid
import asyncio
from enum import Enum

# Initialize FastAPI
app = FastAPI(title="AI Cyber Defense Framework API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "cyber_defense_db")
client = AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]

# Collections
threats_collection = db["threats"]
logs_collection = db["logs"]
scenarios_collection = db["scenarios"]
metrics_collection = db["metrics"]
ml_config_collection = db["ml_config"]
vehicles_collection = db["vehicles"]
system_data_collection = db["system_data"]

# Enums
class ThreatType(str, Enum):
    GPS_SPOOFING = "GPS_SPOOFING"
    CONTROL_HIJACKING = "CONTROL_HIJACKING"
    DATA_TAMPERING = "DATA_TAMPERING"
    ANOMALY_DETECTED = "ANOMALY_DETECTED"

class SeverityLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class SystemStatus(str, Enum):
    OPERATIONAL = "OPERATIONAL"
    UNDER_ATTACK = "UNDER_ATTACK"
    FAILOVER_ACTIVE = "FAILOVER_ACTIVE"
    RECOVERING = "RECOVERING"

# Pydantic Models
class GPSData(BaseModel):
    latitude: float
    longitude: float
    altitude: float
    speed: float

class ControlData(BaseModel):
    commands: List[int]
    source: str
    checksum: int

class SensorData(BaseModel):
    temperature: float
    pressure: float
    humidity: float
    voltage: float
    current: float

class TelemetryData(BaseModel):
    vehicle_id: str
    gps: GPSData
    sensors: SensorData
    control: ControlData

class Threat(BaseModel):
    threat_id: str
    threat_type: ThreatType
    severity: SeverityLevel
    confidence: float
    detected_at: datetime
    vehicle_id: str
    details: Dict[str, Any]
    resolved: bool = False

class AttackScenario(BaseModel):
    scenario_id: str
    name: str
    description: str
    threat_type: ThreatType
    parameters: Dict[str, Any]
    created_at: datetime
    is_custom: bool = True

class MLConfiguration(BaseModel):
    config_id: str
    anomaly_threshold: float = 2.5
    gps_speed_threshold: float = 50.0
    data_window_size: int = 50
    detection_sensitivity: str = "medium"
    auto_response_enabled: bool = True
    updated_at: datetime

class SystemLog(BaseModel):
    log_id: str
    timestamp: datetime
    level: str
    message: str
    details: Optional[Dict[str, Any]] = None

class Vehicle(BaseModel):
    vehicle_id: str
    name: str
    vehicle_type: str
    status: SystemStatus
    last_seen: datetime
    location: Optional[GPSData] = None

# Anomaly Detector Class
class AnomalyDetector:
    def __init__(self):
        self.baseline_mean = None
        self.baseline_std = None
        self.threshold = 2.5
        self.scaler = StandardScaler()
        
    async def set_baseline(self, normal_data: List[List[float]]):
        """Initialize baseline from normal operational data"""
        data_array = np.array(normal_data)
        self.baseline_mean = np.mean(data_array, axis=0)
        self.baseline_std = np.std(data_array, axis=0)
        
    async def detect_anomaly(self, data_point: List[float]) -> Dict[str, Any]:
        """Detect anomalies using Z-score analysis"""
        if self.baseline_mean is None:
            return {"is_anomaly": False, "score": 0, "confidence": 0}
        
        z_scores = np.abs((np.array(data_point) - self.baseline_mean) / (self.baseline_std + 1e-10))
        max_z_score = float(np.max(z_scores))
        is_anomaly = max_z_score > self.threshold
        
        return {
            "is_anomaly": is_anomaly,
            "score": max_z_score,
            "confidence": min(max_z_score / self.threshold, 1.0),
            "details": {
                "z_scores": z_scores.tolist(),
                "threshold": self.threshold
            }
        }
    
    async def detect_gps_spoofing(self, gps_data: GPSData, previous_gps: Optional[GPSData] = None) -> Dict[str, Any]:
        """Detect GPS spoofing patterns"""
        # Check for impossible altitude
        if gps_data.altitude < -500 or gps_data.altitude > 50000:
            return {
                "is_spoofed": True,
                "reason": "Impossible altitude detected",
                "severity": SeverityLevel.CRITICAL
            }
        
        # Check for impossible speed
        if gps_data.speed > 500 or gps_data.speed < 0:
            return {
                "is_spoofed": True,
                "reason": "Impossible speed detected",
                "severity": SeverityLevel.CRITICAL
            }
        
        # Check for impossible location (null island)
        if abs(gps_data.latitude) < 0.1 and abs(gps_data.longitude) < 0.1:
            return {
                "is_spoofed": True,
                "reason": "Suspicious null island coordinates",
                "severity": SeverityLevel.HIGH
            }
        
        return {"is_spoofed": False}
    
    async def detect_control_hijacking(self, control_data: ControlData) -> Dict[str, Any]:
        """Detect control hijacking attempts"""
        # Verify command integrity
        expected_checksum = sum(control_data.commands) % 256
        if control_data.checksum != expected_checksum:
            return {
                "is_hijacked": True,
                "reason": "Command integrity check failed",
                "severity": SeverityLevel.CRITICAL
            }
        
        # Check for authorized sources
        authorized_sources = ["GROUND_CONTROL", "ONBOARD_AI", "EMERGENCY_OVERRIDE"]
        if control_data.source not in authorized_sources:
            return {
                "is_hijacked": True,
                "reason": "Unauthorized command source",
                "severity": SeverityLevel.HIGH
            }
        
        return {"is_hijacked": False}

# Global detector instance
detector = AnomalyDetector()

# Initialize baseline data on startup
@app.on_event("startup")
async def startup_event():
    """Initialize the system on startup"""
    # Generate baseline training data
    normal_data = []
    for _ in range(1000):
        normal_data.append([
            50 + np.random.randn() * 5,    # Temperature
            1013 + np.random.randn() * 3,  # Pressure
            45 + np.random.randn() * 5,    # Humidity
            12.5 + np.random.randn() * 0.3, # Voltage
            2.1 + np.random.randn() * 0.1   # Current
        ])
    
    await detector.set_baseline(normal_data)
    
    # Initialize default ML configuration if not exists
    existing_config = await ml_config_collection.find_one({})
    if not existing_config:
        default_config = {
            "config_id": str(uuid.uuid4()),
            "anomaly_threshold": 2.5,
            "gps_speed_threshold": 50.0,
            "data_window_size": 50,
            "detection_sensitivity": "medium",
            "auto_response_enabled": True,
            "updated_at": datetime.utcnow()
        }
        await ml_config_collection.insert_one(default_config)
    
    # Initialize default scenarios
    existing_scenarios = await scenarios_collection.count_documents({})
    if existing_scenarios == 0:
        default_scenarios = [
            {
                "scenario_id": str(uuid.uuid4()),
                "name": "GPS Spoofing Attack",
                "description": "Simulates GPS coordinate manipulation",
                "threat_type": ThreatType.GPS_SPOOFING,
                "parameters": {"altitude": -1000, "speed": 500},
                "created_at": datetime.utcnow(),
                "is_custom": False
            },
            {
                "scenario_id": str(uuid.uuid4()),
                "name": "Control Hijacking",
                "description": "Simulates unauthorized command injection",
                "threat_type": ThreatType.CONTROL_HIJACKING,
                "parameters": {"source": "UNKNOWN_SOURCE", "invalid_checksum": True},
                "created_at": datetime.utcnow(),
                "is_custom": False
            },
            {
                "scenario_id": str(uuid.uuid4()),
                "name": "Data Tampering",
                "description": "Simulates sensor data corruption",
                "threat_type": ThreatType.DATA_TAMPERING,
                "parameters": {"sensor_corruption": True},
                "created_at": datetime.utcnow(),
                "is_custom": False
            }
        ]
        await scenarios_collection.insert_many(default_scenarios)
    
    # Log startup
    await logs_collection.insert_one({
        "log_id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow(),
        "level": "INFO",
        "message": "AI Cyber Defense Framework initialized successfully",
        "details": {"baseline_samples": 1000}
    })

# API Endpoints

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Monitoring Endpoints

@app.get("/api/monitoring/status")
async def get_system_status():
    """Get current system status"""
    # Get recent threats
    recent_threats = await threats_collection.count_documents({
        "detected_at": {"$gte": datetime.utcnow() - timedelta(minutes=5)},
        "resolved": False
    })
    
    # Determine threat level
    critical_threats = await threats_collection.count_documents({
        "severity": SeverityLevel.CRITICAL,
        "resolved": False
    })
    
    if critical_threats > 0:
        threat_level = SeverityLevel.CRITICAL
    elif recent_threats > 3:
        threat_level = SeverityLevel.HIGH
    elif recent_threats > 0:
        threat_level = SeverityLevel.MEDIUM
    else:
        threat_level = SeverityLevel.LOW
    
    # Get active vehicles
    active_vehicles = await vehicles_collection.count_documents({
        "status": SystemStatus.OPERATIONAL
    })
    
    return {
        "status": SystemStatus.OPERATIONAL,
        "threat_level": threat_level,
        "active_threats": recent_threats,
        "active_vehicles": active_vehicles,
        "system_health": 100 - (recent_threats * 10),
        "timestamp": datetime.utcnow()
    }

@app.post("/api/monitoring/telemetry")
async def process_telemetry(data: TelemetryData):
    """Process incoming telemetry data and detect threats"""
    threats_detected = []
    
    # Convert sensor data to list for anomaly detection
    sensor_values = [
        data.sensors.temperature,
        data.sensors.pressure,
        data.sensors.humidity,
        data.sensors.voltage,
        data.sensors.current
    ]
    
    # Check for anomalies
    anomaly_result = await detector.detect_anomaly(sensor_values)
    if anomaly_result["is_anomaly"]:
        threat = {
            "threat_id": str(uuid.uuid4()),
            "threat_type": ThreatType.ANOMALY_DETECTED,
            "severity": SeverityLevel.MEDIUM if anomaly_result["confidence"] < 0.8 else SeverityLevel.HIGH,
            "confidence": anomaly_result["confidence"],
            "detected_at": datetime.utcnow(),
            "vehicle_id": data.vehicle_id,
            "details": anomaly_result["details"],
            "resolved": False
        }
        await threats_collection.insert_one(threat)
        threats_detected.append(threat)
    
    # Check for GPS spoofing
    gps_result = await detector.detect_gps_spoofing(data.gps)
    if gps_result.get("is_spoofed"):
        threat = {
            "threat_id": str(uuid.uuid4()),
            "threat_type": ThreatType.GPS_SPOOFING,
            "severity": gps_result["severity"],
            "confidence": 0.95,
            "detected_at": datetime.utcnow(),
            "vehicle_id": data.vehicle_id,
            "details": {"reason": gps_result["reason"], "gps_data": data.gps.dict()},
            "resolved": False
        }
        await threats_collection.insert_one(threat)
        threats_detected.append(threat)
    
    # Check for control hijacking
    control_result = await detector.detect_control_hijacking(data.control)
    if control_result.get("is_hijacked"):
        threat = {
            "threat_id": str(uuid.uuid4()),
            "threat_type": ThreatType.CONTROL_HIJACKING,
            "severity": control_result["severity"],
            "confidence": 0.98,
            "detected_at": datetime.utcnow(),
            "vehicle_id": data.vehicle_id,
            "details": {"reason": control_result["reason"], "control_data": data.control.dict()},
            "resolved": False
        }
        await threats_collection.insert_one(threat)
        threats_detected.append(threat)
    
    # Store telemetry
    await system_data_collection.insert_one({
        "data_id": str(uuid.uuid4()),
        "vehicle_id": data.vehicle_id,
        "timestamp": datetime.utcnow(),
        "gps": data.gps.dict(),
        "sensors": data.sensors.dict(),
        "control": data.control.dict(),
        "threats_detected": len(threats_detected)
    })
    
    return {
        "processed": True,
        "threats_detected": len(threats_detected),
        "threats": threats_detected
    }

# Attack Simulation Endpoints

@app.post("/api/attacks/simulate/{attack_type}")
async def simulate_attack(attack_type: ThreatType, vehicle_id: str = "drone-001"):
    """Simulate an attack scenario"""
    threat_data = None
    
    if attack_type == ThreatType.GPS_SPOOFING:
        threat_data = {
            "threat_id": str(uuid.uuid4()),
            "threat_type": attack_type,
            "severity": SeverityLevel.CRITICAL,
            "confidence": 0.99,
            "detected_at": datetime.utcnow(),
            "vehicle_id": vehicle_id,
            "details": {
                "simulated": True,
                "attack_params": {"latitude": 0, "longitude": 0, "altitude": -1000, "speed": 500}
            },
            "resolved": False
        }
    elif attack_type == ThreatType.CONTROL_HIJACKING:
        threat_data = {
            "threat_id": str(uuid.uuid4()),
            "threat_type": attack_type,
            "severity": SeverityLevel.CRITICAL,
            "confidence": 0.98,
            "detected_at": datetime.utcnow(),
            "vehicle_id": vehicle_id,
            "details": {
                "simulated": True,
                "attack_params": {"source": "UNKNOWN_SOURCE", "invalid_checksum": True}
            },
            "resolved": False
        }
    elif attack_type == ThreatType.DATA_TAMPERING:
        threat_data = {
            "threat_id": str(uuid.uuid4()),
            "threat_type": attack_type,
            "severity": SeverityLevel.HIGH,
            "confidence": 0.92,
            "detected_at": datetime.utcnow(),
            "vehicle_id": vehicle_id,
            "details": {
                "simulated": True,
                "attack_params": {"sensor_corruption": True, "corrupted_values": [150, 500, -10, 25, 0.1]}
            },
            "resolved": False
        }
    
    if threat_data:
        result = await threats_collection.insert_one(threat_data)
        
        # Log the simulation
        await logs_collection.insert_one({
            "log_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow(),
            "level": "WARNING",
            "message": f"Attack simulation started: {attack_type}",
            "details": {"threat_id": threat_data["threat_id"], "vehicle_id": vehicle_id}
        })
        
        # Return without MongoDB ObjectId
        response_data = {
            "success": True,
            "threat_id": threat_data["threat_id"],
            "threat_type": threat_data["threat_type"],
            "severity": threat_data["severity"],
            "message": f"Attack simulation '{attack_type}' initiated successfully"
        }
        
        return response_data
    
    raise HTTPException(status_code=400, detail="Invalid attack type")

# Threats Endpoints

@app.get("/api/threats")
async def get_threats(limit: int = 50, resolved: Optional[bool] = None):
    """Get list of threats"""
    query = {}
    if resolved is not None:
        query["resolved"] = resolved
    
    threats = await threats_collection.find(query).sort("detected_at", -1).limit(limit).to_list(length=limit)
    
    # Convert ObjectId to string for JSON serialization
    for threat in threats:
        threat["_id"] = str(threat["_id"])
    
    return {"threats": threats, "count": len(threats)}

@app.put("/api/threats/{threat_id}/resolve")
async def resolve_threat(threat_id: str):
    """Mark a threat as resolved"""
    result = await threats_collection.update_one(
        {"threat_id": threat_id},
        {"$set": {"resolved": True, "resolved_at": datetime.utcnow()}}
    )
    
    if result.modified_count > 0:
        await logs_collection.insert_one({
            "log_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow(),
            "level": "INFO",
            "message": f"Threat resolved: {threat_id}"
        })
        return {"success": True}
    
    raise HTTPException(status_code=404, detail="Threat not found")

@app.get("/api/threats/export")
async def export_threats(format: str = "json"):
    """Export threat reports"""
    threats = await threats_collection.find({}).sort("detected_at", -1).to_list(length=None)
    
    # Convert ObjectId to string
    for threat in threats:
        threat["_id"] = str(threat["_id"])
        threat["detected_at"] = threat["detected_at"].isoformat()
        if "resolved_at" in threat:
            threat["resolved_at"] = threat["resolved_at"].isoformat()
    
    if format == "json":
        return JSONResponse(content={"threats": threats, "exported_at": datetime.utcnow().isoformat()})
    elif format == "csv":
        # Create CSV content
        import csv
        from io import StringIO
        
        output = StringIO()
        if threats:
            writer = csv.DictWriter(output, fieldnames=threats[0].keys())
            writer.writeheader()
            writer.writerows(threats)
        
        return JSONResponse(content={"csv_data": output.getvalue(), "exported_at": datetime.utcnow().isoformat()})
    
    return {"threats": threats}

# Scenarios Endpoints

@app.get("/api/scenarios")
async def get_scenarios():
    """Get all attack scenarios"""
    scenarios = await scenarios_collection.find({}).to_list(length=None)
    
    for scenario in scenarios:
        scenario["_id"] = str(scenario["_id"])
        scenario["created_at"] = scenario["created_at"].isoformat()
    
    return {"scenarios": scenarios}

@app.post("/api/scenarios")
async def create_scenario(scenario: AttackScenario):
    """Create a custom attack scenario"""
    scenario_dict = scenario.dict()
    scenario_dict["scenario_id"] = str(uuid.uuid4())
    scenario_dict["created_at"] = datetime.utcnow()
    scenario_dict["is_custom"] = True
    
    await scenarios_collection.insert_one(scenario_dict)
    
    await logs_collection.insert_one({
        "log_id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow(),
        "level": "INFO",
        "message": f"Custom scenario created: {scenario.name}"
    })
    
    return {"success": True, "scenario_id": scenario_dict["scenario_id"]}

@app.delete("/api/scenarios/{scenario_id}")
async def delete_scenario(scenario_id: str):
    """Delete a custom scenario"""
    scenario = await scenarios_collection.find_one({"scenario_id": scenario_id})
    
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    if not scenario.get("is_custom", False):
        raise HTTPException(status_code=400, detail="Cannot delete built-in scenarios")
    
    await scenarios_collection.delete_one({"scenario_id": scenario_id})
    
    return {"success": True}

# ML Configuration Endpoints

@app.get("/api/ml-config")
async def get_ml_config():
    """Get ML configuration"""
    config = await ml_config_collection.find_one({})
    
    if config:
        config["_id"] = str(config["_id"])
        config["updated_at"] = config["updated_at"].isoformat()
        return config
    
    return {"error": "Configuration not found"}

@app.put("/api/ml-config")
async def update_ml_config(config: MLConfiguration):
    """Update ML configuration"""
    config_dict = config.dict()
    config_dict["updated_at"] = datetime.utcnow()
    
    # Update detector threshold
    detector.threshold = config.anomaly_threshold
    
    await ml_config_collection.update_one(
        {},
        {"$set": config_dict},
        upsert=True
    )
    
    await logs_collection.insert_one({
        "log_id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow(),
        "level": "INFO",
        "message": "ML configuration updated",
        "details": config_dict
    })
    
    return {"success": True, "config": config_dict}

# Logs Endpoints

@app.get("/api/logs")
async def get_logs(limit: int = 100, level: Optional[str] = None):
    """Get system logs"""
    query = {}
    if level:
        query["level"] = level
    
    logs = await logs_collection.find(query).sort("timestamp", -1).limit(limit).to_list(length=limit)
    
    for log in logs:
        log["_id"] = str(log["_id"])
        log["timestamp"] = log["timestamp"].isoformat()
    
    return {"logs": logs}

# Recovery Endpoints

@app.post("/api/recovery/initiate")
async def initiate_recovery():
    """Initiate system recovery"""
    # Resolve all active threats
    result = await threats_collection.update_many(
        {"resolved": False},
        {"$set": {"resolved": True, "resolved_at": datetime.utcnow()}}
    )
    
    await logs_collection.insert_one({
        "log_id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow(),
        "level": "INFO",
        "message": "System recovery initiated",
        "details": {"threats_resolved": result.modified_count}
    })
    
    return {
        "success": True,
        "threats_resolved": result.modified_count,
        "status": "Recovery complete"
    }

# Metrics Endpoints

@app.get("/api/metrics")
async def get_metrics():
    """Get detection performance metrics"""
    total_threats = await threats_collection.count_documents({})
    resolved_threats = await threats_collection.count_documents({"resolved": True})
    
    # Get threat distribution
    gps_spoofing = await threats_collection.count_documents({"threat_type": ThreatType.GPS_SPOOFING})
    control_hijacking = await threats_collection.count_documents({"threat_type": ThreatType.CONTROL_HIJACKING})
    data_tampering = await threats_collection.count_documents({"threat_type": ThreatType.DATA_TAMPERING})
    anomalies = await threats_collection.count_documents({"threat_type": ThreatType.ANOMALY_DETECTED})
    
    return {
        "total_threats": total_threats,
        "resolved_threats": resolved_threats,
        "active_threats": total_threats - resolved_threats,
        "threat_distribution": {
            "gps_spoofing": gps_spoofing,
            "control_hijacking": control_hijacking,
            "data_tampering": data_tampering,
            "anomalies": anomalies
        },
        "detection_rate": 0.95,  # Simulated
        "false_positive_rate": 0.05  # Simulated
    }

# Vehicles Endpoints

@app.get("/api/vehicles")
async def get_vehicles():
    """Get all vehicles"""
    vehicles = await vehicles_collection.find({}).to_list(length=None)
    
    for vehicle in vehicles:
        vehicle["_id"] = str(vehicle["_id"])
        vehicle["last_seen"] = vehicle["last_seen"].isoformat()
    
    return {"vehicles": vehicles}

@app.post("/api/vehicles")
async def create_vehicle(vehicle: Vehicle):
    """Register a new vehicle"""
    vehicle_dict = vehicle.dict()
    vehicle_dict["vehicle_id"] = str(uuid.uuid4())
    vehicle_dict["last_seen"] = datetime.utcnow()
    vehicle_dict["status"] = SystemStatus.OPERATIONAL
    
    await vehicles_collection.insert_one(vehicle_dict)
    
    return {"success": True, "vehicle_id": vehicle_dict["vehicle_id"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)