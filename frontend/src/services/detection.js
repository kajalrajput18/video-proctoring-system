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
    this.lastFaceTime = Date.now();
    this.lastLookingTime = Date.now();
    this.noFaceStartTime = null;
    this.lookingAwayStartTime = null;
    this.objectModel = null;
    this.faceMesh = null;
    this.initialized = false;
  }

  async start() {
    try {
      // Initialize TensorFlow.js first
      await setupTf();
      
      this.isRunning = true;
      
      // Initialize object detection model
      console.log('Loading object detection model...');
      this.objectModel = await cocoSsd.load();
      console.log('Object detection model loaded');
      
      // For now, let's skip MediaPipe and use a simpler face detection
      // Start periodic checks
      this.checkInterval = setInterval(() => {
        this.detectObjects();
      }, 2000); // Check every 2 seconds
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing detection:', error);
    }
  }

  stop() {
    this.isRunning = false;
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  async detectObjects() {
    if (!this.objectModel || !this.isRunning || !this.videoElement) return;
    
    try {
      const predictions = await this.objectModel.detect(this.videoElement);
      
      const personDetections = predictions.filter(p => p.class === 'person');
      
      if (personDetections.length === 0) {
        if (!this.noFaceStartTime) {
          this.noFaceStartTime = Date.now();
        } else {
          const duration = (Date.now() - this.noFaceStartTime) / 1000;
          if (duration > 10) {
            this.onDetectionCallback({
              type: 'no_face',
              severity: 'high',
              message: `No person detected for ${Math.round(duration)} seconds`,
              duration: Math.round(duration)
            });
            this.noFaceStartTime = Date.now(); // Reset
          }
        }
      } else {
        this.noFaceStartTime = null;
        
        // Check for multiple people
        if (personDetections.length > 1) {
          this.onDetectionCallback({
            type: 'multiple_faces',
            severity: 'high',
            message: `${personDetections.length} people detected in frame`
          });
        }
      }
      
      // Check for unauthorized objects
      predictions.forEach(prediction => {
        const { class: objectClass, score } = prediction;
        
        if (score > 0.6) {
          switch (objectClass) {
            case 'cell phone':
              this.onDetectionCallback({
                type: 'phone_detected',
                severity: 'high',
                message: 'Mobile phone detected in frame'
              });
              break;
            case 'book':
              this.onDetectionCallback({
                type: 'book_detected',
                severity: 'high',
                message: 'Book detected in frame'
              });
              break;
            case 'laptop':
            case 'tv':
              this.onDetectionCallback({
                type: 'device_detected',
                severity: 'high',
                message: `Electronic device (${objectClass}) detected`
              });
              break;
          }
        }
      });
    } catch (error) {
      console.error('Detection error:', error);
    }
  }
}