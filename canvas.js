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

let shapeIcons = document.querySelectorAll(".shape");

let textSizeIcons = document.querySelectorAll(".text-size");
let textFamilyIcons = document.querySelectorAll(".text-family");

let download = document.querySelector(".download");

let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let reset = document.querySelector(".reset");

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

let undoRedoTracker = []; // data
let track = 0; // represets which to perform from tracker array

let currentShape = "";
let drawShape = false;
let startX = "";
let startY = "";

let textSize = 20;
let textFamily = "normal";
let textColor = "#000000";

canvas.addEventListener("mousedown", (e) => {
  if (pencilToolsFlag) {
    drawPencil = true;
    startDrawing({ x: e.clientX, y: e.clientY });
  } else if (markerToolsFlag) {
    drawMarker = true;
    startDrawing({ x: e.clientX, y: e.clientY });
  } else if (currentShape !== "") {
    drawShape = true;
    startX = e.clientX;
    startY = e.clientY;
    // startDrawingShape({ x: e.clientX, y: e.clientY });
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
  } else if (currentShape !== "" && drawShape) {
    continueDrawingShape({ x: e.clientX, y: e.clientY });
  }
});

canvas.addEventListener("mouseup", (e) => {
  drawPencil = false;
  drawMarker = false;

  if (currentShape !== "") {
    finishDrawingShape();
    drawShape = false;
  }

  saveUndoHistory();
});

// canvas.addEventListener("click", (e) => {
//   console.log({ textToolsFlag });
//   if (textToolsFlag) {
//     let text = prompt("Enter text:");
//     if (text !== null) {
//       tool.font = `${textSize}px ${textFamily}`;
//       tool.fillStyle = textColor;
//       tool.fillText(text, e.clientX, e.clientY);
//       saveUndoHistory();
//       textToolsFlag = false;
//     }
//   }
// });

canvas.addEventListener("click", (e) => {
  if (textToolsFlag) {
    const textarea = document.createElement("textarea");
    textarea.style.position = "absolute";
    textarea.style.left = `${e.clientX}px`;
    textarea.style.top = `${e.clientY}px`;
    textarea.style.font = `${textSize}px ${textFamily}`;
    textarea.style.color = textColor;
    textarea.style.border = "1px solid black";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.overflow = "hidden";
    textarea.style.background = "transparent";
    textarea.style.zIndex = "1000"; // Ensure it's above other elements
    textarea.addEventListener("keydown", (event) => {
      // Save the text when Enter is pressed
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent the default behavior of Enter
        tool.fillText(
          textarea.value,
          parseInt(textarea.style.left),
          parseInt(textarea.style.top) + textSize
        );
        document.body.removeChild(textarea); // Remove the textarea element
        saveUndoHistory();
        textToolsFlag = false;
      }
    });
    document.body.appendChild(textarea); // Append the textarea to the body
    textarea.focus(); // Focus on the textarea for typing
  }
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

textSizeIcons.forEach((sizeIcon) => {
  sizeIcon.addEventListener("click", () => {
    textSize = parseInt(sizeIcon.innerText);
  });
});

textFamilyIcons.forEach((familyIcon) => {
  familyIcon.addEventListener("click", () => {
    textFamily = familyIcon.classList.contains("hand")
      ? "Handwriting"
      : familyIcon.classList.contains("code")
      ? "Monospace"
      : "Sans-serif";
  });
});

pencilColors.forEach((color) => {
  color.addEventListener("click", () => {
    let chosenColor = window
      .getComputedStyle(color)
      .getPropertyValue("background-color");

    if (textToolsFlag) {
      textColor = chosenColor;
    } else {
      pencilColor = chosenColor;
      tool.strokeStyle = pencilColor;
    }
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

function redrawUndoHistory() {
  // Clear the canvas
  canvas.width = canvas.width;

  // Create new image objects for each saved state in the undoRedoTracker array
  for (let i = 0; i <= track; i++) {
    let img = new Image();
    img.src = undoRedoTracker[i];
    // Draw the image onto the canvas
    tool.drawImage(img, 0, 0);
  }
}

function saveUndoHistory() {
  let url = canvas.toDataURL();
  undoRedoTracker.push(url);
  track = undoRedoTracker.length - 1;
}

function startDrawingShape(position) {
  tool.beginPath();
  tool.moveTo(position.x, position.y);
}

function continueDrawingShape(position) {
  tool.strokeStyle = "#1e1e1e";
  tool.lineWidth = "3";

  switch (currentShape) {
    case "square":
      let width = position.x - startX;
      let height = position.y - startY;
      tool.clearRect(0, 0, canvas.width, canvas.height);
      // Redraw the previous image (if any)
      redrawUndoHistory();
      tool.beginPath();
      tool.rect(startX, startY, width, height);
      tool.stroke();
      break;

    case "circle":
      let radius = Math.sqrt(
        (position.x - startX) ** 2 + (position.y - startY) ** 2
      );
      tool.clearRect(0, 0, canvas.width, canvas.height);
      redrawUndoHistory();
      tool.beginPath();
      tool.arc(startX, startY, radius, 0, 2 * Math.PI);
      tool.stroke();
      break;

    case "diamond":
      let diamondWidth = Math.abs(position.x - startX);
      let diamondHeight = Math.abs(position.y - startY);
      tool.clearRect(0, 0, canvas.diamondWidth, canvas.diamondHeight);
      redrawUndoHistory();
      tool.beginPath();
      tool.moveTo(startX, startY - diamondHeight / 2); // Top point
      tool.lineTo(startX + diamondWidth / 2, startY); // Right point
      tool.lineTo(startX, startY + diamondHeight / 2); // Bottom point
      tool.lineTo(startX - diamondWidth / 2, startY); // Left point
      tool.closePath();
      tool.stroke();
      break;
    case "rectangle":
      let rectWidth = position.x - startX;
      let rectHeight = position.y - startY;
      tool.clearRect(0, 0, canvas.width, canvas.height);
      redrawUndoHistory();
      tool.beginPath();
      tool.rect(startX, startY, rectWidth, rectHeight);
      tool.stroke();
      break;
    case "triangle":
      let triangleWidth = position.x - startX;
      let triangleHeight = position.y - startY;
      tool.clearRect(0, 0, canvas.width, canvas.height);
      redrawUndoHistory();
      tool.beginPath();
      // Start from the top vertex and draw the triangle
      tool.moveTo(startX, startY);
      // Draw the triangle to the right
      tool.lineTo(startX + triangleWidth, startY);
      // Draw the triangle to the bottom
      tool.lineTo(startX + triangleWidth / 2, startY + triangleHeight);
      // Close the path to complete the triangle
      tool.closePath();
      tool.stroke();
      break;
  }
  tool.stroke();
}

function finishDrawingShape() {
  // saveUndoHistory();
  currentShape = "";
}

shapeIcons.forEach((shape) => {
  shape.addEventListener("click", (e) => {
    currentShape = shape.getAttribute("alt").toLowerCase();
  });
});

download.addEventListener("click", (e) => {
  resetCursor();

  let url = canvas.toDataURL();

  let a = document.createElement("a");
  a.href = url;
  a.download = "doodle-board.jpg";
  a.click();
});

undo.addEventListener("click", (e) => {
  resetCursor();

  if (track > 0) {
    track--;
    undoRedoCanvas({ track, undoRedoTracker });
    redo.disabled = false; // Enable the redo button if it was disabled
  }
});

redo.addEventListener("click", (e) => {
  resetCursor();

  if (track < undoRedoTracker.length - 1) {
    track++;
    undoRedoCanvas({ track, undoRedoTracker });
    undo.disabled = false; // Enable the undo button if it was disabled
  }
});

function undoRedoCanvas(tracker) {
  track = tracker.track;
  undoRedoTracker = tracker.undoRedoTracker;

  let img = new Image();
  img.src = undoRedoTracker[track];
  img.onload = (e) => {
    tool.clearRect(0, 0, canvas.width, canvas.height);
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}

reset.addEventListener("click", (e) => {
  resetCursor();

  tool.clearRect(0, 0, canvas.width, canvas.height);
});
