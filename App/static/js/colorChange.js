 // Get the canvas element
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');

    // Get the target color picker element
    let targetColorPicker = document.getElementById('targetColor');

    // Get the replacement color picker element
    let replacementColorPicker = document.getElementById('replacementColor');

    // Get the range slider element
    let rangeSlider = document.getElementById('rangeSlider');

    let suggestionButton = document.getElementById("getSuggestionButton")

    const colorSuggestions = document.getElementById("colorSuggestions")

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
    const applyColorChange=async()=> {
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
      previousImageURL = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

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
        
      let canvasImage =document.getElementById("canvasImage");

      let canvas = document.getElementById("myCanvas");
      let ctx = canvas.getContext("2d");

      canvas.height=canvasImage.height;
      canvas.width = canvasImage.width;
      ctx.drawImage(canvasImage, 0, 0);
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
        document.getElementById("canvasImage").src=canvas.toDataURL();
        previousImageURL = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        
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


// Get colors from API
const getColorSuggestions = async()=>{

  const hex =targetColorPicker.value.substring(1,targetColorPicker.value.length);
  const reponse = await fetch(`https://www.thecolorapi.com/scheme?hex=${hex}`);
  const data = await reponse.json();
  console.log(data["colors"]);

  colorSuggestions.hidden=false;
  
  for(let i=0;i<5;i++){
    let color=data["colors"][i]
    let hexColor =color["hex"]["value"]
    let constrast = color["contrast"]["value"]

    let suggestion = document.getElementById("colorSuggestions"+String(i+1))
    suggestion.innerHTML=color["name"]["value"] +"<br></br>" + hexColor 

    if(constrast=="#000000"){
      suggestion.style=`background-color:${hexColor}; color: ${constrast}; text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px white;`
    }else{
      suggestion.style=`background-color:${hexColor}; color: ${constrast}; text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px black;`
    }


    suggestion.addEventListener("click",()=>{
      replacementColorPicker.value=hexColor
    })
  }

}


suggestionButton.addEventListener("click",getColorSuggestions);


// Save functions
const downloadForm = document.getElementById("downloadForm")
const fileName = document.getElementById("fileName")

function openDownloadOptions(){
  downloadForm.hidden = false;
  fileName.value = imageName.value
}

const closeDownloadOptions =document.getElementById("closeDownload")

closeDownloadOptions.addEventListener("click",()=>{
  downloadForm.hidden=true
})


const downloadFileButton = document.getElementById('downloadButton');

downloadFileButton.addEventListener('click',download_image)

function download_image(){
  var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  var link = document.createElement('a');
  link.download = fileName.value+".png";
  link.href = image;
  link.click();
}



let downloadButton = document.getElementById("downloadButton");

downloadButton.addEventListener("click",openDownloadOptions);

let saveOnlineButton = document.getElementById("saveOnlineButton")

const getImageUrl = () =>{
  let data=canvas.toDataURL("image/png");
  return data;
}

document.getElementById("openDownload").addEventListener("click",openDownloadOptions)

const saveForm = document.getElementById("saveForm");
const imageString = document.getElementById("imageString");

if(saveOnlineButton!= null){
  saveOnlineButton.addEventListener("click",()=>{
    imageString.value= getImageUrl();
    saveForm.hidden= false;
  })
}


let closefrom = document.getElementById("closeForm")

closefrom.addEventListener("click",()=>{
  saveForm.hidden=true;
})

const img = new Image();


const updateImageString = document.getElementById("updateImageImage")
const updateId = document.getElementById("updateId")
const updateName = document.getElementById("updateImageName")
const updateDescription = document.getElementById("updateImageDescription")

const imageName = document.getElementById("imageName")
const imageDescription = document.getElementById("imageDescription")

let quickSave=document.getElementById("quickSave")


let closeSaveform = document.getElementById("closeUpdateForm")
let updateForm = document.getElementById("updateForm")
if(closeSaveform!=null){
  closeSaveform.addEventListener("click",()=>{
    updateForm.hidden = true;
  })
}

if(quickSave!=null){
  quickSave.addEventListener("click",()=>{
    updateImageString.value = getImageUrl();
    updateDescription.value = imageDescription.value;
    updateName.value = imageName.value;
    updateForm.hidden=false;
  })
}

if(saveOnlineButton){
  saveOnlineButton.addEventListener("click",()=>{
    imageString.value= getImageUrl();
    saveForm.hidden= false;
  
  })
}


const undoButton = document.getElementById("undo")


undoButton.addEventListener('click',revertImage)

const initialData=document.getElementById("canvasImage").src
let compareModeButton = document.getElementById('compareMode');
let compareMode = false;


compareModeButton.addEventListener('click',toogleCompareMode)

const lastSaveHeader = document.getElementById("lastSaveText");
const currentWorkText = document.getElementById("currentChangesText");

function toogleCompareMode(){
  if (compareMode){
    compareModeButton.innerHTML="Compare Mode";
    compareMode = false;
    currentWorkText.hidden = true;
    lastSaveHeader.hidden = true

    canvasImage.hidden = true;

  }
  else{
    compareModeButton.innerHTML="Leave Compare Mode";
    canvasImage.hidden=false;
    currentWorkText.hidden = false;
    lastSaveHeader.hidden = false;

    compareMode=true;

  }
}