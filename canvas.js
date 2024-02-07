let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColors = document.querySelectorAll(".pencil-color");
let pencilWidth = document.querySelector(".pencil-width-input");
let eraserIcon = document.querySelector(".eraser");
let eraserWidth = document.querySelector(".eraser-width");
let pencilEdges = document.querySelectorAll(".pencil-edge");
let pencilPatterns = document.querySelectorAll(".pencil-pattern");

let tool = canvas.getContext("2d");

let draw = false;
let eraserColor = "#fff";
let pencilColor = "#1e1e1e";
let pencilEdge = "sqaure";

let eraserSize = eraserWidth.value;
let pencilSize = pencilWidth.value;

tool.strokeStyle = pencilColor;
tool.lineWidth = pencilSize;
tool.lineCap = pencilEdge;

canvas.addEventListener("mousedown", (e) => {
  draw = true;
  startDrawing({ x: e.clientX, y: e.clientY });
});

canvas.addEventListener("mousemove", (e) => {
  if (draw && pencilToolsFlag) {
    continueDrawing({
      color: eraserToolsFlag ? eraserColor : pencilColor,
      width: eraserToolsFlag ? eraserSize : pencilSize,
      x: e.clientX,
      y: e.clientY,
    });
  }
});

canvas.addEventListener("mouseup", (e) => {
  draw = false;
});

function startDrawing(movement) {
  tool.beginPath();
  tool.moveTo(movement.x, movement.y);
}

function continueDrawing(movement) {
  tool.strokeStyle = movement.color;
  tool.lineWidth = movement.width;
  tool.lineTo(movement.x, movement.y);
  tool.stroke();
}

pencilColors.forEach((color) => {
  color.addEventListener("click", () => {
    let chosenColor = window
      .getComputedStyle(color)
      .getPropertyValue("background-color");

    pencilColor = chosenColor;
    tool.strokeStyle = pencilColor;
  });
});

pencilWidth.addEventListener("change", (e) => {
  pencilSize = parseInt(e.target.value);
  tool.lineWidth = pencilSize;
});

pencilEdges.forEach((edge) => {
  edge.addEventListener("click", (e) => {
    let chosenEdge = edge.getAttribute("alt").split(" ")[0].toLowerCase();
    pencilEdge = chosenEdge;
    tool.lineCap = pencilEdge;
  });
});

let lineStyles = [
  [], // Solid line
  [15, 10], // Dashed line
  [2, 10], // Dotted line
];

pencilPatterns.forEach((pattern, index) => {
  pattern.addEventListener("click", () => {
    let currentLineStyleIndex = index;
    tool.setLineDash(lineStyles[currentLineStyleIndex]);
  });
});

eraserWidth.addEventListener("change", (e) => {
  eraserSize = parseInt(e.target.value);
  tool.lineWidth = eraserSize;
});

eraserIcon.addEventListener("click", (e) => {
  if (eraserToolsFlag) {
    tool.strokeStyle = eraserColor;
    tool.lineWidth = eraserSize;
  } else {
    tool.strokeStyle = pencilColor;
    tool.lineWidth = pencilSize;
  }
});
