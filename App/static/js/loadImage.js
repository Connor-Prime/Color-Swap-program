var canvasImage =document.getElementById("canvasImage")
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

canvas.height=canvasImage.height
canvas.width = canvasImage.width
ctx.drawImage(canvasImage, 0, 0);