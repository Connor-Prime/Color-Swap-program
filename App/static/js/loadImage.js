const loadImage = function(img) {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 10, 10);
  };