import * as faceDetection from '@mediapipe/face_detection';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

async function setupTf() {
  await tf.ready();
  await tf.setBackend('webgl');
}

export class FaceDetection {
  constructor(videoElement, onDetectionCallback) {
    this.videoElement = videoElement;
    this.onDetectionCallback = onDetectionCallback;
    this.isRunning = false;
    this.sessionId = sessionId;
    // Timers for detection
    this.noFaceStartTime = null;
    this.lookingAwayStartTime = null;
    this.headTurnStartTime = null;
    
    // Models
    this.objectModel = null;
    this.faceDetector = null;
    
    // Flags
    this.initialized = false;
    this.objectInterval = null;
    this.faceDetectionInterval = null;
  }

  async start() {
    try {
      await setupTf();
      this.isRunning = true;

      // Initialize MediaPipe Face Detection
      this.faceDetector = new faceDetection.FaceDetection({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
        }
      });
      
      this.faceDetector.setOptions({
        model: 'short',
        minDetectionConfidence: 0.5
      });
      
      this.faceDetector.onResults(this.handleFaceResults.bind(this));

      // Initialize Object Detection model
      console.log('Loading object detection model...');
      this.objectModel = await cocoSsd.load();
      console.log('Object detection model loaded');

      // Start both detectors
      this.startObjectDetection();
      this.startFaceDetection();
      
      this.initialized = true;
      console.log('Detection system started successfully');
    } catch (error) {
      console.error('Error initializing detection:', error);
    }
  }

  startObjectDetection() {
    // Object detection every 2 seconds
    this.objectInterval = setInterval(() => {
      this.detectObjects();
    }, 2000);
  }

  startFaceDetection() {
    // Face detection every 1 second
    this.faceDetectionInterval = setInterval(() => {
      if (this.videoElement && this.videoElement.videoWidth > 0) {
        this.faceDetector.send({ image: this.videoElement });
      }
    }, 1000);
  }

  // ✅ 1. Detect if no face is present for >10 sec
  handleFaceResults(results) {
    if (!results.detections || !this.isRunning) return;

    if (results.detections.length === 0) {
      this.handleNoFace();
    } else {
      this.handleFacesDetected(results.detections);
    }
  }

  handleNoFace() {
    if (!this.noFaceStartTime) {
      this.noFaceStartTime = Date.now();
      console.log('No face detected - starting timer');
    } else {
      const duration = (Date.now() - this.noFaceStartTime) / 1000;
      
      // ✅ Trigger after 10 seconds of no face
      if (duration > 10) {
        this.onDetectionCallback({
          type: 'no_face',
          severity: 'high',
          message: `No face detected for ${Math.round(duration)} seconds`,
          duration: Math.round(duration),
          timestamp: new Date().toISOString()
        });
        this.noFaceStartTime = Date.now(); // Reset timer
      }
    }
  }

  handleFacesDetected(faces) {
    // Reset no face timer
    this.noFaceStartTime = null;

    // ✅ 2. Detect multiple faces in the frame
    if (faces.length > 1) {
      this.onDetectionCallback({
        type: 'multiple_faces',
        severity: 'high',
        message: `${faces.length} people detected in frame`,
        count: faces.length,
        timestamp: new Date().toISOString()
      });
    }

    // ✅ 3. Detect if candidate is not looking at screen for >5 sec
    faces.forEach(face => {
      this.checkGazeDirection(face);
    });
  }

  checkGazeDirection(face) {
    if (!face.keypoints || face.keypoints.length < 3) return;

    const rightEye = face.keypoints[0];
    const leftEye = face.keypoints[1];
    const noseTip = face.keypoints[2];

    if (!rightEye || !leftEye || !noseTip) return;

    // Calculate gaze direction
    const rightEyeOffset = rightEye.x - noseTip.x;
    const leftEyeOffset = leftEye.x - noseTip.x;
    const avgOffset = (rightEyeOffset + leftEyeOffset) / 2;
    
    const gazeThreshold = 25; // pixels threshold for looking away

    if (Math.abs(avgOffset) > gazeThreshold) {
      if (!this.lookingAwayStartTime) {
        this.lookingAwayStartTime = Date.now();
      } else {
        const duration = (Date.now() - this.lookingAwayStartTime) / 1000;
        
        // ✅ Trigger after 5 seconds of looking away
        if (duration > 5) {
          const direction = avgOffset > 0 ? 'right' : 'left';
          
          this.onDetectionCallback({
            type: 'looking_away',
            severity: 'medium',
            message: `Looking ${direction} for ${Math.round(duration)} seconds`,
            duration: Math.round(duration),
            direction: direction,
            timestamp: new Date().toISOString()
          });
        }
      }
    } else {
      this.lookingAwayStartTime = null;
    }
  }

  // ✅ 4. Object Detection for unauthorized items
  async detectObjects() {
    if (!this.objectModel || !this.isRunning || !this.videoElement) return;

    try {
      const predictions = await this.objectModel.detect(this.videoElement);
      
      // ✅ Detect unauthorized objects
      predictions.forEach(prediction => {
        const { class: objectClass, score } = prediction;
        
        if (score > 0.6) {
          let eventType = null;
          let severity = 'high';
          let message = '';

          switch (objectClass) {
            case 'cell phone':
              eventType = 'phone_detected';
              message = 'Mobile phone detected';
              break;
              
            case 'book':
              eventType = 'book_detected';
              message = 'Book or notes detected';
              break;
              
            case 'laptop':
            case 'tv':
            case 'monitor':
            case 'keyboard':
            case 'mouse':
              eventType = 'electronic_device';
              message = `Extra electronic device (${objectClass}) detected`;
              break;
              
            case 'cup':
            case 'bottle':
            case 'glass':
              eventType = 'beverage_detected';
              severity = 'low';
              message = `${objectClass} detected`;
              break;

            default:
              return; // Skip other objects
          }

          // ✅ 5. Flag and log in real time
          if (eventType) {
            this.onDetectionCallback({
              type: eventType,
              severity: severity,
              message: message,
              object: objectClass,
              confidence: score,
              timestamp: new Date().toISOString()
            });
          }
        }
      });

    } catch (error) {
      console.error('Object detection error:', error);
    }
  }

  stop() {
    this.isRunning = false;
    
    if (this.objectInterval) {
      clearInterval(this.objectInterval);
    }
    if (this.faceDetectionInterval) {
      clearInterval(this.faceDetectionInterval);
    }
    
    console.log('Detection system stopped');
  }

  // ✅ Utility method to get detection status
  getStatus() {
    return {
      isRunning: this.isRunning,
      initialized: this.initialized,
      noFaceDuration: this.noFaceStartTime ? (Date.now() - this.noFaceStartTime) / 1000 : 0,
      lookingAwayDuration: this.lookingAwayStartTime ? (Date.now() - this.lookingAwayStartTime) / 1000 : 0
    };
  }
}