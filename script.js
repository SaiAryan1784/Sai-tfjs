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
        startFaceDetection();
      };
    })
    .catch((err) => {
      console.error("Error accessing camera:", err);
    });
};

const startFaceDetection = async () => {
  try {
    model = await blazeface.load();
    setInterval(detectFaces, 1000); // Reduce the interval for testing
  } catch (error) {
    console.error("Error loading model:", error);
  }
};

const detectFaces = async () => {
  if (!model || !video || !canvas || !ctx) {
    console.error("Model or video elements not initialized.");
    return;
  }

  const prediction = await model.estimateFaces(video, false);

  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the video frame on canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Draw yellow rectangles around detected faces
  prediction.forEach((predictions) => {
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.strokeStyle = "yellow";
    ctx.rect(
      predictions.topLeft[0],
      predictions.topLeft[1],
      predictions.bottomRight[0] - predictions.topLeft[0],
      predictions.bottomRight[1] - predictions.topLeft[1]
    );
    ctx.stroke();

    // Capture the detected face as an image
    const faceWidth = predictions.bottomRight[0] - predictions.topLeft[0];
    const faceHeight = predictions.bottomRight[1] - predictions.topLeft[1];
    const faceCanvas = document.createElement('canvas');
    const faceCtx = faceCanvas.getContext('2d');
    faceCanvas.width = faceWidth;
    faceCanvas.height = faceHeight;
    faceCtx.drawImage(
      video,
      predictions.topLeft[0],
      predictions.topLeft[1],
      faceWidth,
      faceHeight,
      0,
      0,
      faceWidth,
      faceHeight
    );
    const imageDataUrl = faceCanvas.toDataURL('image/jpeg');
    console.log("Captured face image:", imageDataUrl);
  });
};

// Start accessing camera and face detection
accessCamera();
