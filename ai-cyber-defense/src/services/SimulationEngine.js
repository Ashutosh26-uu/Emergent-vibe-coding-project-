export class SimulationEngine {
  constructor() {
    this.isRunning = false;
    this.attackScenarios = [];
    this.normalOperationData = [];
    this.currentScenario = null;
  }

  // Generate normal operational data
  generateNormalData() {
    return {
      timestamp: Date.now(),
      gps: {
        latitude: 40.7128 + (Math.random() - 0.5) * 0.001,
        longitude: -74.0060 + (Math.random() - 0.5) * 0.001,
        altitude: 100 + Math.random() * 50,
        speed: 15 + Math.random() * 5,
        timestamp: Date.now()
      },
      sensors: [
        50 + Math.random() * 10,  // Temperature
        1013 + Math.random() * 5, // Pressure
        45 + Math.random() * 10,  // Humidity
        12.5 + Math.random() * 0.5, // Voltage
        2.1 + Math.random() * 0.2   // Current
      ],
      control: {
        commands: [0x01, 0x02, 0x03, 0x04],
        source: 'GROUND_CONTROL',
        timestamp: Date.now(),
        checksum: 10
      }
    };
  }

  // Simulate GPS spoofing attack
  simulateGPSSpoofing() {
    const normalData = this.generateNormalData();
    
    // Inject spoofed GPS data
    normalData.gps = {
      latitude: 0, // Impossible location
      longitude: 0,
      altitude: -1000, // Impossible altitude
      speed: 500, // Impossible speed
      timestamp: Date.now()
    };
    
    return {
      ...normalData,
      attackType: 'GPS_SPOOFING',
      severity: 'CRITICAL'
    };
  }

  // Simulate control hijacking
  simulateControlHijacking() {
    const normalData = this.generateNormalData();
    
    // Inject malicious control commands
    normalData.control = {
      commands: [0xFF, 0xEE, 0xDD, 0xCC], // Malicious commands
      source: 'UNKNOWN_SOURCE',
      timestamp: Date.now(),
      checksum: 99 // Wrong checksum
    };
    
    return {
      ...normalData,
      attackType: 'CONTROL_HIJACKING',
      severity: 'CRITICAL'
    };
  }

  // Simulate data tampering
  simulateDataTampering() {
    const normalData = this.generateNormalData();
    
    // Tamper with sensor data
    normalData.sensors = [
      150,  // Impossible temperature
      500,  // Impossible pressure
      -10,  // Impossible humidity
      25,   // Dangerous voltage
      0.1   // Dangerous current
    ];
    
    return {
      ...normalData,
      attackType: 'DATA_TAMPERING',
      severity: 'HIGH'
    };
  }

  // Simulate subtle anomalies
  simulateAnomalies() {
    const normalData = this.generateNormalData();
    
    // Introduce subtle anomalies
    normalData.sensors = normalData.sensors.map(value => 
      value + (Math.random() - 0.5) * value * 0.3 // 30% deviation
    );
    
    return {
      ...normalData,
      attackType: 'ANOMALY_DETECTED',
      severity: 'MEDIUM'
    };
  }

  // Run attack simulation
  startAttackSimulation(attackType, duration = 10000) {
    this.isRunning = true;
    this.currentScenario = attackType;
    
    const scenario = {
      type: attackType,
      startTime: Date.now(),
      duration: duration,
      events: []
    };

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        let simulatedData;
        
        switch (attackType) {
          case 'GPS_SPOOFING':
            simulatedData = this.simulateGPSSpoofing();
            break;
          case 'CONTROL_HIJACKING':
            simulatedData = this.simulateControlHijacking();
            break;
          case 'DATA_TAMPERING':
            simulatedData = this.simulateDataTampering();
            break;
          case 'ANOMALIES':
            simulatedData = this.simulateAnomalies();
            break;
          default:
            simulatedData = this.generateNormalData();
        }
        
        scenario.events.push(simulatedData);
        
        if (Date.now() - scenario.startTime >= duration) {
          clearInterval(interval);
          this.isRunning = false;
          this.currentScenario = null;
          resolve(scenario);
        }
      }, 1000);
    });
  }

  // Generate baseline training data
  generateTrainingData(samples = 1000) {
    const trainingData = [];
    
    for (let i = 0; i < samples; i++) {
      const data = this.generateNormalData();
      trainingData.push(data.sensors);
    }
    
    return trainingData;
  }

  getSimulationStatus() {
    return {
      isRunning: this.isRunning,
      currentScenario: this.currentScenario,
      availableScenarios: [
        'GPS_SPOOFING',
        'CONTROL_HIJACKING', 
        'DATA_TAMPERING',
        'ANOMALIES'
      ]
    };
  }
}