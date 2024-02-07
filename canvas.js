let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColors = document.querySelectorAll(".pencil-color");
let pencilWidth = document.querySelector(".pencil-width-input");
let pencilEdges = document.querySelectorAll(".pencil-edge");
let pencilPatterns = document.querySelectorAll(".pencil-pattern");

let markerColors = document.querySelectorAll(".marker-color");
let markerWidth = document.querySelector(".marker-width-input");
let markerPatterns = document.querySelectorAll(".marker-pattern");

let eraserIcon = document.querySelector(".eraser");
let eraserWidth = document.querySelector(".eraser-width");

let tool = canvas.getContext("2d");

let drawPencil = false;
let drawMarker = false;
let pencilColor = "#1e1e1e";
let markerColor = "#afafaf";
let pencilEdge = "sqaure";
let eraserColor = "#fff";

let pencilSize = pencilWidth.value;
let markerSize = markerWidth.value;
let eraserSize = eraserWidth.value;

tool.strokeStyle = pencilColor;
tool.lineWidth = pencilSize;
tool.lineCap = pencilEdge;

canvas.addEventListener("mousedown", (e) => {
  if (pencilToolsFlag) {
    drawPencil = true;
    startDrawing({ x: e.clientX, y: e.clientY });
  } else if (markerToolsFlag) {
    drawMarker = true;
    startDrawing({ x: e.clientX, y: e.clientY });
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (drawPencil && pencilToolsFlag) {
    continueDrawing({
      color: eraserToolsFlag ? eraserColor : pencilColor,
      width: eraserToolsFlag ? eraserSize : pencilSize,
      x: e.clientX,
      y: e.clientY,
    });
  } else if (drawMarker && markerToolsFlag) {
    continueDrawing({
      color: eraserToolsFlag ? eraserColor : markerColor,
      width: eraserToolsFlag ? eraserSize : markerSize,
      x: e.clientX,
      y: e.clientY,
    });
  }
});

canvas.addEventListener("mouseup", (e) => {
  drawPencil = false;
  drawMarker = false;
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

markerColors.forEach((color) => {
  color.addEventListener("click", () => {
    let chosenColor = window
      .getComputedStyle(color)
      .getPropertyValue("background-color");

    markerColor = chosenColor;
    tool.strokeStyle = markerColor;
  });
});

markerWidth.addEventListener("change", (e) => {
  markerSize = parseInt(e.target.value);
  tool.lineWidth = markerSize;
});

markerPatterns.forEach((pattern, index) => {
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
