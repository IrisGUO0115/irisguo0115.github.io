const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearcanvas = document.querySelector(".clear-canvas"),
saveImag = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");


let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5;
selectedColor = "#000";



const setCanvasBackground = () => {
    // set the background of the entire canvas to white in order to ensure that the downloaded image has a white background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; //resetting the fillStyle to the selectedColor will ensure that the brush color is applied
}
window.addEventListener("load", () => {
    //setting canvas width/height..offsetwidth/height returns viewable width/height of an element
   canvas.width = canvas.offsetWidth;
   canvas.height = canvas.offsetHeight;
});

const drawRect = (e) => {
    // if the fillColor option is not checked, draw a rectangle with a border; otherwise, draw a rectangle with a background
    if(!fillColor.checked) {
        //creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    
}

const drawCircle = (e) => {
    ctx.beginPath();//creating new path to draw circle
    //getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();//if the fillColor option is not checked, draw a circle with a border; otherwise, draw a circle with a background
}
const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; 
    prevMouseY = e.offsetY; 
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; //passing the brushSize as the line width
    ctx.strokeStyle = selectedColor;//passing the selectedColor as fill style
    ctx.fillStyle = selectedColor;//passing the selectedColor as fill style
    snapshot = ctx.getImageData(0,0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return; //if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); 
    
    if(selectedTool === "brush" || selectedTool === "eraser") {
        // if selected tool is eraser then set strokeStyle to white
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);//creating line according to the mouse pointer
        ctx.stroke(); //drawing/filing line with color
    } else if (selectedTool === "rectangle"){
        drawRect(e);
    } else if (selectedTool === "circle"){
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
   
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { //adding click event to all too option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);//passing slider value as brushSize

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all color button
        //removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
        //passing selected btn background color as selecedColor value
    });
});

colorPicker.addEventListener("change",() => {
    //passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearcanvas.addEventListener("click", () => {
   ctx.clearRect(0, 0, canvas.width, canvas.height);//clearing whole canvas
   setCanvasBackground();
});

saveImag.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = 'download.jpg';
    link.href = canvas.toDataURL();
    link.click();//clicking link to download image
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", ()=> isDrawing = false);