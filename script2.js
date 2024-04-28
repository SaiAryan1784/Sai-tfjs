let video;
let model;

// declare the canvas variable and setting up the context 
let canvas;
let ctx;

const accessCamera = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: { width: 500, height: 400 },
      audio: false,
    })
    .then((stream) => {
      video = document.getElementById("video");
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
        // Initialize canvas and context after video is loaded
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        // Start face detection after video is loaded
        loadFaceAPI();
      };
    })
    .catch((err) => {
      console.error("Error accessing camera:", err);
    });
};

const loadFaceAPI = async () => {
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    startFaceDetection();
  } catch (error) {
    console.error("Error loading face-api:", error);
  }
};

const startFaceDetection = async () => {
  try {
    setInterval(detectFaces, 1000); // Reduce the interval for testing
  } catch (error) {
    console.error("Error starting face detection:", error);
  }
};

const detectFaces = async () => {
  if (!video || !canvas || !ctx) {
    console.error("Video or canvas elements not initialized.");
    return;
  }

  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the video frame on canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Detect faces
  const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());

  // Draw yellow rectangles around detected faces
  detections.forEach((detection) => {
    const box = detection.box;
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.strokeStyle = "yellow";
    ctx.rect(box.x, box.y, box.width, box.height);
    ctx.stroke();
  });

  // You can add additional functionalities like capturing face images here
};

// Start accessing camera and face detection
accessCamera();
