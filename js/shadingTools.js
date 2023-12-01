    // Get the canvas element
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');

    // Boolean flag for enabling/disabling color increase and decrease
    var allowColorChange = false;

    var darken=false;

    // Variables to store the mouse coordinates
    var mouseX = 0;
    var mouseY = 0;

    var shadeProofThreshold=0;
    // Get the radius and change value amount sliders
    var radiusSlider = document.getElementById('radiusSlider');
    var sadeProofSlider = document.getElementById('shadeProofColor');


    var shadeproofColor=document.getElementById("shadeProofColor");
    // Function to handle mousemove event
    function handleMouseMove(event) {
      var rect = canvas.getBoundingClientRect();
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top; 
    }

    // Function to handle mousedown event
    function handleMouseDown() {
      allowColorChange = true;
    }

    // Function to handle mouseup event
    function handleMouseUp() {
      allowColorChange = false;
    }

    // Function to increase RGB values
    function increaseColors() {
      allowColorChange = true;
      darken=false;
    }


    // Function to decrease RGB values
  function decreaseColors() {
    allowColorChange = true;
    darken=true;
  }

      // Add event listeners for the "Increase Colors" and "Decrease Colors" buttons
    var increaseColorsButton = document.getElementById('increaseColors');
    increaseColorsButton.addEventListener('click', increaseColors);

    var decreaseColorsButton = document.getElementById('decreaseColors');
    decreaseColorsButton.addEventListener('click', decreaseColors);
    // Add event listeners for mouse press and release
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);


    // Add event listener for the mousemove event
    canvas.addEventListener('mousemove', handleMouseMove);

    var ShadeProofSlider = document.getElementById('ShadeproofThreshold');

    ShadeProofSlider.addEventListener('input', function() {
      // Update the circle radius based on the slider value
      shadeProofThreshold = parseInt(ShadeProofSlider.value);
    });

    // Function to update colors based on the flag and mouse coordinates
    function updateColors() {
      if ( allowColorChange) {
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;

        var centerX = mouseX;
        var centerY = mouseY;

        var radius = parseInt(radiusSlider.value);
        var changeValueAmount = parseInt(changeValueSlider.value);

        var shadeProofColor = {
          red: parseInt(shadeproofColor.value.substring(1, 3), 16),
          green: parseInt(shadeproofColor.value.substring(3, 5), 16),
          blue: parseInt(shadeproofColor.value.substring(5, 7), 16),
          alpha: 1
        };
        
        if(darken){
          changeValueAmount=0-changeValueAmount;
        }

        for (var y = 0; y < canvas.height; y++) {
          for (var x = 0; x < canvas.width; x++) {
            var distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

            if(x==0&&y==0){
              var base_color_index = (y * canvas.width + x) * 4;
              base_color_red = Math.min(pixels[index] + changeValueAmount, 255); // Red
              base_color_blue = Math.min(pixels[index + 1] + changeValueAmount, 255); // Green
              base_color_green = Math.min(pixels[index + 2] + changeValueAmount, 255); // Blue
            }
           
            if (distance <= radius) {
              var index = (y * canvas.width + x) * 4;
              // Increase red, green, and blue values
              if(Math.abs(pixels[index]-shadeProofColor.red)<shadeProofThreshold&&
              Math.abs(pixels[index+1]-shadeProofColor.green)<shadeProofThreshold&&
              Math.abs(pixels[index+2]-shadeProofColor.blue)<shadeProofThreshold){
                continue;
              }
              pixels[index] = Math.min(pixels[index] + changeValueAmount, 255); // Red
              pixels[index + 1] = Math.min(pixels[index + 1] + changeValueAmount, 255); // Green
              pixels[index + 2] = Math.min(pixels[index + 2] + changeValueAmount, 255); // Blue
            }

            if (darken){
              if(pixels[index]<base_color_red){
                pixels[index] = base_color_red;
              }
              if(pixels[index+1]<base_color_blue){
                pixels[index + 1] = base_color_blue;
              }
              if(pixels[index+2]<base_color_green){

                pixels[index + 2] = base_color_green; // Blue
              }
            }else{
              if(pixels[index]>base_color_red){
                pixels[index] = base_color_red;
              }
              if(pixels[index+1]>base_color_blue){
                pixels[index + 1] = base_color_blue;
              }
              if(pixels[index+2]>base_color_green){

                pixels[index + 2] = base_color_green; // Blue
              }
            }
          }
        }

        context.putImageData(imageData, 0, 0);
      }

      setTimeout(updateColors, 500-ShadeSpeedSlider.value); // Update colors every 10 milliseconds
    }

    // Start the update loop
    updateColors();