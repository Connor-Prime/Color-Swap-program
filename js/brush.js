// Variables to track mouse press state and circle fill state
var isMouseDown = false;
var isCircleFillEnabled = false;

// Get Brush Color from here
var colorPicker = document.getElementById('brushColor');
// Get the canvas element by ID
var canvas = document.getElementById('myCanvas');
// Get the 2D rendering context for the canvas
var context = canvas.getContext('2d');

var brushRadiusSlider = document.getElementById('brushSize');
var radius = 10;

brushRadiusSlider.addEventListener('input', function() {
    // Update the circle radius based on the slider value
    radius = parseInt(brushRadiusSlider.value);
    document.getElementById("brushRadiusText").innerHTML="Brush Radius: "+brushRadiusSlider.value;
  });
  
// Function to handle mouse press
function handleMouseDown() {
  isMouseDown = true;
  if (isCircleFillEnabled) {
    fillCircle();
  }
}

// Function to handle mouse release
function handleMouseUp() {
  isMouseDown = false;
}

// Function to handle mouse move
function handleMouseMove(event) {
  if (isCircleFillEnabled && isMouseDown) {
    fillCircle(event.clientX, event.clientY);
  }
}

// Function to fill a circle with the selected color
function fillCircle(mouseX, mouseY) {
  var rect = canvas.getBoundingClientRect();
  mouseX -= rect.left;
  mouseY -= rect.top;
  var color = colorPicker.value;
  context.beginPath();
  context.arc(mouseX, mouseY, radius, 0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();
}

// Function to toggle the circle fill state
function toggleCircleFillState() {
  isCircleFillEnabled = !isCircleFillEnabled;
  if (isCircleFillEnabled) {
    fillCircle();
  }
}

// Add event listeners for mouse press, release, and move
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);

// Get the toggle button element by ID
var toggleButton = document.getElementById('brush_button');

// Add event listener for the toggle button
toggleButton.addEventListener('click', toggleCircleFillState);
