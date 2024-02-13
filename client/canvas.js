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

let canvasBgColors = document.querySelectorAll(".canvas-color");

let download = document.querySelector(".download");

let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let reset = document.querySelector(".reset");

let drawPencil = false;
let drawMarker = false;
let drawEraser = false;

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

let isDragging = false;
let offsetX, offsetY;

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
  if ((drawPencil && pencilToolsFlag.value) || drawEraser) {
    const data = {
      color: eraserToolsFlag.value ? eraserColor : pencilColor,
      width: eraserToolsFlag.value ? eraserSize : pencilSize,
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

canvas.addEventListener("click", (e) => {
  if (textToolsFlag.value) {
    const textarea = document.createElement("textarea");
    textarea.style.position = "absolute";
    textarea.style.left = `${e.clientX}px`;
    textarea.style.top = `${e.clientY}px`;
    textarea.style.fontSize = textSize;
    textarea.classList.add(textFamily);
    textarea.style.color = textColor;
    textarea.style.border = "1px solid black";
    textarea.style.outline = "none";
    textarea.style.resize = "both";
    textarea.style.overflow = "hidden";
    textarea.style.background = "transparent";
    textarea.style.zIndex = "1000"; // Ensure it's above other elements

    textarea.addEventListener("mousedown", (event) => {
      isDragging = true;
      offsetX = event.clientX - parseInt(textarea.style.left);
      offsetY = event.clientY - parseInt(textarea.style.top);
    });

    textarea.addEventListener("mousemove", (event) => {
      if (isDragging) {
        textarea.style.left = `${event.clientX - offsetX}px`;
        textarea.style.top = `${event.clientY - offsetY}px`;
      } else {
        // Check if the mouse is near the border of the textarea
        const borderThreshold = 5;
        const textareaRect = textarea.getBoundingClientRect();
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Check if the mouse is within the borderThreshold of any side of the textarea
        const nearTop =
          mouseY >= textareaRect.top &&
          mouseY <= textareaRect.top + borderThreshold;
        const nearBottom =
          mouseY <= textareaRect.bottom &&
          mouseY >= textareaRect.bottom - borderThreshold;
        const nearLeft =
          mouseX >= textareaRect.left &&
          mouseX <= textareaRect.left + borderThreshold;
        const nearRight =
          mouseX <= textareaRect.right &&
          mouseX >= textareaRect.right - borderThreshold;

        if (nearTop || nearBottom || nearLeft || nearRight) {
          // If the mouse is near any side, change the cursor to 'move'
          textarea.style.cursor = "move";
        } else {
          textarea.style.cursor = "default";
        }
      }
    });

    textarea.addEventListener("mouseup", () => {
      isDragging = false;
    });

    textarea.addEventListener("keydown", (event) => {
      // save the text when enter is pressed
      if (event.key === "Enter") {
        event.preventDefault();
        tool.fillText(
          textarea.value,
          parseInt(textarea.style.left),
          parseInt(textarea.style.top) + textSize
        );
        document.body.removeChild(textarea);
        saveUndoHistory();
        textToolsFlag.value = false;
      }
    });

    textarea.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        tool.fillText(
          textarea.value,
          parseInt(textarea.style.left),
          parseInt(textarea.style.top) + textSize
        );
        document.body.removeChild(textarea);
        saveUndoHistory();
        textToolsFlag.value = false;
      } else if (event.key === "Delete" || event.key === "Backspace") {
        document.body.removeChild(textarea);
        textToolsFlag.value = false;
      }
    });

    document.body.appendChild(textarea);
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
  tool.globalCompositeOperation = movement.composite;
  tool.lineTo(movement.x, movement.y);
  tool.stroke();
}

textSizeIcons.forEach((sizeIcon) => {
  sizeIcon.addEventListener("click", () => {
    let chosenSize = sizeIcon.getAttribute("title");
    textSize = chosenSize;
  });
});

textFamilyIcons.forEach((familyIcon) => {
  familyIcon.addEventListener("click", () => {
    const chosenFont = familyIcon.getAttribute("class").split(" ")[0];
    textFamily = chosenFont;
  });
});

pencilColors.forEach((color) => {
  color.addEventListener("click", () => {
    let chosenColor = window
      .getComputedStyle(color)
      .getPropertyValue("background-color");

    if (textToolsFlag.value) {
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

canvasBgColors.forEach((bgColor) => {
  bgColor.addEventListener("click", (e) => {
    let chosenBgColor = window
      .getComputedStyle(bgColor)
      .getPropertyValue("background-color");

    document.body.style.backgroundColor = chosenBgColor;

    // tool.fillStyle = chosenBgColor;
    // tool.fillRect(0, 0, canvas.width, canvas.height);
  });
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
    // let data = { track, undoRedoTracker };
    // socket.emit("undoRedoCanvas", data);
    undoRedoCanvas({ track, undoRedoTracker });
    redo.disabled = false; // Enable the redo button if it was disabled
  }
});

redo.addEventListener("click", (e) => {
  resetCursor();

  if (track < undoRedoTracker.length - 1) {
    track++;
    // let data = { track, undoRedoTracker };
    // socket.emit("undoRedoCanvas", data);
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

// socket.on("startDrawing", (data) => {
//   startDrawing(data);
// });

// socket.on("continueDrawing", (data) => {
//   continueDrawing(data);
// });

// socket.on("undoRedoCanvas", (data) => {
//   undoRedoCanvas(data);
// });
