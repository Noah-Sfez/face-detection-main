import * as faceapi from 'face-api.js';
import * as tf from '@tensorflow/tfjs';
async function setupCamera() {
  const video = document.getElementById('video');
  // Demander l'accès à la webcam
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      console.error("Error accessing webcam: ", err);
    });
  // Initialiser le backend WebGL de TensorFlow.js
  await tf.setBackend('webgl');
  await tf.ready();
  console.log('TensorFlow.js backend:', tf.getBackend());
  // Charger les modèles de face-api.js depuis le dossier local
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models').then(() => console.log('Tiny Face Detector loaded'));
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models').then(() => console.log('Face Landmark 68 Net loaded'));
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models').then(() => console.log('Face Recognition Net loaded'));
  await faceapi.nets.faceExpressionNet.loadFromUri('/models').then(() => console.log('Face Expression Net loaded'));
  video.addEventListener('play', () => {
    const canvas = document.getElementById('overlay');
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
      console.log('Detections:', detections);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 100);
  });
}
setupCamera();
