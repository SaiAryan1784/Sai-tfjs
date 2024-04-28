// let video = document.getElementById("video"); // Optional, for webcam usage
let model;
// // Declare the canvas variable and setting up the context
// let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const fileInput = document.getElementById("fileInput"); // Assuming you have an element with this ID

// const accessCamera = async () => { // Maintain webcam functionality (optional)
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: { width: 500, height: 400 },
//       audio: false,
//     });
//     video.srcObject = stream;
//   } catch (error) {
//     console.error("Error accessing camera:", error);
//   }
// };

const detectFacesFromFile = async (file) => {
  const reader = new FileReader();
  reader.onload = async (event) => {
    const image = new Image();
    image.onload = async () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      const prediction = await model.estimateFaces(canvas, false);

      prediction.forEach((predictions) => {
        // Draw rectangle that'll detect the face
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
      });
    };
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
};

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  detectFacesFromFile(file);
});

accessCamera(); // Call this if you want webcam functionality
video.addEventListener("loadeddata", async () => { // Optional, for webcam usage
  model = await blazeface.load();
});
