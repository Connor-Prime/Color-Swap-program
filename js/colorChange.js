 // Get the canvas element
    let canvas = document.getElementById('myCanvas');
    let context = canvas.getContext('2d');

    // Get the target color picker element
    let targetColorPicker = document.getElementById('targetColor');

    // Get the replacement color picker element
    let replacementColorPicker = document.getElementById('replacementColor');

    // Get the range slider element
    let rangeSlider = document.getElementById('rangeSlider');

    // Function to check if a color is within the range of another color
    function isWithinRange(color1, color2, range) {
      return (
        Math.abs(color1.red - color2.red) <= range &&
        Math.abs(color1.green - color2.green) <= range &&
        Math.abs(color1.blue - color2.blue) <= range &&
        Math.abs(color1.alpha - color2.alpha) <= range
      );
    }

    // Function to get the RGBA value at a given coordinate on the canvas
    function getPixelColor(x, y) {
      let pixelData = context.getImageData(x, y, 1, 1).data;
      return {
        red: pixelData[0],
        green: pixelData[1],
        blue: pixelData[2],
        alpha: pixelData[3] / 255
      };
    }

    // Function to apply the color change on the canvas
    function applyColorChange() {
      let targetColor = {
        red: parseInt(targetColorPicker.value.substring(1, 3), 16),
        green: parseInt(targetColorPicker.value.substring(3, 5), 16),
        blue: parseInt(targetColorPicker.value.substring(5, 7), 16),
        alpha: 1
      };

      let replacementColor = {
        red: parseInt(replacementColorPicker.value.substring(1, 3), 16),
        green: parseInt(replacementColorPicker.value.substring(3, 5), 16),
        blue: parseInt(replacementColorPicker.value.substring(5, 7), 16),
        alpha: 1
      };

      let range = parseInt(rangeSlider.value);

      // Save previous image data before applying color change
      previousImageData = context.getImageData(0, 0, canvas.width, canvas.height);
      previousImageURL = canvas.toDataURL();

      let imageData = previousImageData;
      let pixels = imageData.data;

      for (let i = 0; i < pixels.length; i += 4) {
        let x = (i / 4) % canvas.width;
        let y = Math.floor(i / 4 / canvas.width);
        let pixelColor = getPixelColor(x, y);

        if (isWithinRange(pixelColor, targetColor, range)) {
          pixels[i] = replacementColor.red;
          pixels[i + 1] = replacementColor.green;
          pixels[i + 2] = replacementColor.blue;
          pixels[i + 3] = Math.round(replacementColor.alpha * 255);
        }
      }

      context.putImageData(imageData, 0, 0);
    }

    // Function to revert the canvas image to the previous image
    function revertImage() {
      if (previousImageData) {
        context.putImageData(previousImageData, 0, 0);
      } else if (previousImageURL) {
        let image = new Image();
        image.onload = function() {
          context.drawImage(image, 0, 0);
        };
        image.src = previousImageURL;
      }
    }

    // Function to handle image file upload
    function handleImageUpload(event) {
      let imageInput = event.target;
      let imageFile = imageInput.files[0];
      let image = new Image();

      image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        // Save the initial image as the previous image
        previousImageData = context.getImageData(0, 0, canvas.width, canvas.height);
        previousImageURL = canvas.toDataURL();
      };

      let reader = new FileReader();
      reader.onload = function(event) {
        image.src = event.target.result;
      };

      reader.readAsDataURL(imageFile);
    }

    // Add event listener for the image file input
    let imageInput = document.getElementById('imageInput');
    imageInput.addEventListener('change', handleImageUpload);

    // Add event listener for the "Apply Color Change" button click
    let applyColorChangeButton = document.getElementById('applyColorChange');
    applyColorChangeButton.addEventListener('click', applyColorChange);

    // Add event listener for the "Revert Image" button click
    let revertImageButton = document.getElementById('revertImage');
    revertImageButton.addEventListener('click', revertImage);