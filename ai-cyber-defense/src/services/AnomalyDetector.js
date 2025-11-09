import { Matrix } from 'ml-matrix';

export class AnomalyDetector {
  constructor() {
    this.baseline = null;
    this.threshold = 2.5;
    this.windowSize = 50;
    this.dataBuffer = [];
  }

  // Initialize baseline from normal operational data
  setBaseline(normalData) {
    const matrix = new Matrix(normalData);
    this.baseline = {
      mean: matrix.mean('column'),
      std: matrix.standardDeviation('column', { unbiased: true })
    };
  }

  // Detect anomalies using statistical analysis
  detectAnomaly(dataPoint) {
    if (!this.baseline) return { isAnomaly: false, score: 0 };

    const zScores = dataPoint.map((value, index) => {
      const mean = this.baseline.mean[index];
      const std = this.baseline.std[index];
      return Math.abs((value - mean) / (std || 1));
    });

    const maxZScore = Math.max(...zScores);
    const isAnomaly = maxZScore > this.threshold;

    this.dataBuffer.push({ dataPoint, score: maxZScore, timestamp: Date.now() });
    if (this.dataBuffer.length > this.windowSize) {
      this.dataBuffer.shift();
    }

    return {
      isAnomaly,
      score: maxZScore,
      confidence: Math.min(maxZScore / this.threshold, 1),
      details: zScores.map((score, index) => ({
        parameter: `param_${index}`,
        zScore: score,
        threshold: this.threshold
      }))
    };
  }

  // Detect GPS spoofing patterns
  detectGPSSpoofing(gpsData) {
    const { latitude, longitude, altitude, speed, timestamp } = gpsData;
    
    // Check for impossible movements
    if (this.dataBuffer.length > 0) {
      const lastGPS = this.dataBuffer[this.dataBuffer.length - 1];
      const timeDiff = (timestamp - lastGPS.timestamp) / 1000; // seconds
      const distance = this.calculateDistance(
        lastGPS.latitude, lastGPS.longitude,
        latitude, longitude
      );
      const calculatedSpeed = distance / timeDiff;
      
      // Flag if speed difference is too high
      if (Math.abs(calculatedSpeed - speed) > 50) { // 50 m/s threshold
        return {
          isSpoofed: true,
          reason: 'Impossible speed change detected',
          severity: 'HIGH'
        };
      }
    }

    // Check for altitude anomalies
    if (altitude < -500 || altitude > 50000) {
      return {
        isSpoofed: true,
        reason: 'Impossible altitude detected',
        severity: 'CRITICAL'
      };
    }

    return { isSpoofed: false };
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  // Detect control hijacking attempts
  detectControlHijacking(controlData) {
    const { commands, source, timestamp, checksum } = controlData;
    
    // Verify command integrity
    const expectedChecksum = this.calculateChecksum(commands);
    if (checksum !== expectedChecksum) {
      return {
        isHijacked: true,
        reason: 'Command integrity check failed',
        severity: 'CRITICAL'
      };
    }

    // Check for unauthorized command sources
    const authorizedSources = ['GROUND_CONTROL', 'ONBOARD_AI', 'EMERGENCY_OVERRIDE'];
    if (!authorizedSources.includes(source)) {
      return {
        isHijacked: true,
        reason: 'Unauthorized command source',
        severity: 'HIGH'
      };
    }

    return { isHijacked: false };
  }

  calculateChecksum(data) {
    return data.reduce((sum, byte) => sum + byte, 0) % 256;
  }
}