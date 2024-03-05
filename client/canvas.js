let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let tool = canvas.getContext("2d");

let pencilColors = document.querySelectorAll(".pencil-color");
let pencilWidth = document.querySelector(".pencil-width-input");
let pencilEdges = document.querySelectorAll(".pencil-edge");
let pencilPatterns = document.querySelectorAll(".pencil-pattern");

let markerColors = document.querySelectorAll(".marker-color");
let markerWidth = document.querySelector(".marker-width-input");
let markerPatterns = document.querySelectorAll(".marker-pattern");

let eraserIcon = document.querySelector(".eraser");
let eraserWidth = document.querySelector(".eraser-width");

let drawPencil = false;

let pencilColor = "#1e1e1e";
let pencilEdge = "sqaure";

let pencilSize = pencilWidth.value;

tool.strokeStyle = pencilColor;
tool.lineWidth = pencilSize;
tool.lineCap = pencilEdge;

canvas.addEventListener("mousedown", (e) => {
  if (pencilToolsFlag.value) {
    drawPencil = true;
    startDrawing({ x: e.clientX, y: e.clientY });
  } else if (markerToolsFlag.value) {
    drawMarker = true;
    startDrawing({ x: e.clientX, y: e.clientY });
  } else if (eraserToolsFlag.value) {
    drawEraser = true;
    startDrawing({ x: e.clientX, y: e.clientY });
    tool.globalCompositeOperation = "destination-out";
  } else if (currentShape !== "") {
    drawShape = true;
    startX = e.clientX;
    startY = e.clientY;
    // startDrawingShape({ x: e.clientX, y: e.clientY });
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (drawPencil && pencilToolsFlag.value) {
    const data = {
      color: pencilColor,
      width: pencilSize,
      x: e.clientX,
      y: e.clientY,
      composite: eraserToolsFlag.value ? "destination-out" : "source-over",
    };
    continueDrawing(data);
  } else if ((drawMarker && markerToolsFlag.value) || drawEraser) {
    const markerData = {
      color: eraserToolsFlag.value ? eraserColor : markerColor,
      width: eraserToolsFlag.value ? eraserSize : markerSize,
      x: e.clientX,
      y: e.clientY,
      composite: eraserToolsFlag.value ? "destination-out" : "source-over",
    };
    continueDrawing(markerData);
  } else if (currentShape !== "" && drawShape) {
    continueDrawingShape({ x: e.clientX, y: e.clientY });
  }
});

canvas.addEventListener("mouseup", (e) => {
  drawPencil = false;
  drawMarker = false;
  drawEraser = false;

  if (currentShape !== "") {
    finishDrawingShape();
    drawShape = false;
  }

  // Reset the global composite operation to default when not erasing
  if (!drawEraser) {
    tool.globalCompositeOperation = "source-over";
  }

  saveUndoHistory();
});

function startDrawing(movement) {
  tool.beginPath();
  tool.moveTo(movement.x, movement.y);
}

function continueDrawing(movement) {
  tool.strokeStyle = movement.color;
  tool.lineWidth = movement.width;
  tool.globalCompositeOperation = movement.composite;
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
  if (eraserToolsFlag.value) {
    tool.globalCompositeOperation = "destination-out";
    tool.strokeStyle = eraserColor;
    tool.lineWidth = eraserSize;
  } else {
    tool.globalCompositeOperation = "source-over";
    tool.strokeStyle = pencilColor;
    tool.lineWidth = pencilSize;
  }
});
