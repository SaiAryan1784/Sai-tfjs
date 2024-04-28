let model;
let imageDataUrl;
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    const fileInput = document.getElementById("fileInput");
    const capturedFaceImage = document.getElementById("capturedFaceImage"); // Reference the img element

    (async () => {
      model = await blazeface.load(); // Load the model first

      fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        detectFacesFromFile(file);
      }, { once: true }); // Add listener with "once" option
    })();

    const detectFacesFromFile = async (file) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const image = new Image();
        image.onload = async () => {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);

          const prediction = await model.estimateFaces(canvas, false);

          prediction.forEach((predictions, index) => {
            // Draw rectangle with increased line width
            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.strokeStyle = "yellow";
            ctx.rect(
              predictions.topLeft[0],
              predictions.topLeft[1],
              predictions.bottomRight[0] - predictions.topLeft[0],
              predictions.bottomRight[1] - predictions.topLeft[1]
            );
            ctx.stroke();

            const faceTopLeftX = predictions.topLeft[0];
            const faceTopLeftY = predictions.topLeft[1];
            const faceWidth = predictions.bottomRight[0] - predictions.topLeft[0];
            const faceHeight = predictions.bottomRight[1] - predictions.topLeft[1];

            if (index === 0) { // Capture for the first face only
              const faceCanvas = document.createElement('canvas');
              faceCanvas.width = faceWidth;
              faceCanvas.height = faceHeight;
              const faceCtx = faceCanvas.getContext('2d');

              faceCtx.drawImage(
                image,
                faceTopLeftX,
                faceTopLeftY,
                faceWidth,
                faceHeight,
                0,
                0,
                faceWidth,
                faceHeight
            );
            imageDataUrl = faceCanvas.toDataURL('image/jpeg');
                console.log("Captured face image:", imageDataUrl);

                domtoimage.toJpeg(faceCanvas, { quality: 100 })
                .then(dataUrl => {
                    console.log(dataUrl);
                  // You can optionally display the captured face image:
                  // capturedFaceImage.src = dataUrl;
                })
                .catch(error => {
                    console.error("Error capturing screenshot:", error);
                });
            }
            });
        };
            image.src = event.target.result;
        };
      reader.readAsDataURL(file, "image/png"); // or "image/jpeg"
    };

    let model2, webcam, labelContainer, maxPredictions;

    async function init() {
            const URL = "https://teachablemachine.withgoogle.com/models/pOaORa87c/";
            const model2URL = URL + "model2.json";
            const metadataURL = URL + "metadata.json";

            model2 = await tmImage.load(model2URL, metadataURL);
            maxPredictions = model2.getTotalClasses();

            webcam = new tmImage.Webcam(200, 200, true);
            await webcam.setup();
            await webcam.play();
            window.requestAnimationFrame(loop);

            document.getElementById("video").srcObject = webcam.canvas;

            labelContainer = document.getElementById("label-container");
            for (let i = 0; i < maxPredictions; i++) {
                labelContainer.appendChild(document.createElement("div"));
            }
        }

        async function loop() {
            webcam.update();
            await predict();
            window.requestAnimationFrame(loop);
        }

        async function predict() {
            const prediction = await model2.predict(webcam.canvas);
            for (let i = 0; i < maxPredictions; i++) {
                const classPrediction =
                    prediction[i].className + ": " + prediction[i].probability.toFixed(2);
                labelContainer.childNodes[i].innerHTML = classPrediction;
            }
        }

        init();