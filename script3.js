let video = document.getElementById("video");
let model;
// Declare the canvas variable and setting up the context
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const accessCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 500, height: 400 },
      audio: false,
    });
    video.srcObject = stream;
  } catch (error) {
    console.error("Error accessing camera:", error);
  }
};

const detectFaces = async () => {
  const prediction = await model.estimateFaces(video, false);

  // Draw video on canvas first
  ctx.drawImage(video, 0, 0, 500, 400);

  if (prediction.length > 0) {
    const face = prediction[0]; // Assuming you only want to capture the first face

    // Capture the face area from the video
    const capturedImage = canvas.toDataURL("image/jpeg", 0.8); // Adjust quality as needed (0-1)

    console.log("Captured face image URL:", capturedImage);

    // Optional: Reset canvas to avoid accumulating previous frames
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

accessCamera();

video.addEventListener("loadeddata", async () => {
  model = await blazeface.load();
  setInterval(detectFaces, 40);
});
