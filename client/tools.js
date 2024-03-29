let toggleOptions = document.querySelector(".toggle-options");
let toggleFlag = true;

let tools = document.querySelector(".tools");

let pencil = document.querySelector(".pencil");
let pencilTools = document.querySelector(".pencil-tools");
let pencilToolsFlag = false;

let marker = document.querySelector(".marker");
let markerTools = document.querySelector(".marker-tools");
let markerToolsFlag = false;

let eraser = document.querySelector(".eraser");
let eraserTools = document.querySelector(".eraser-tools");
let eraserToolsFlag = false;

let stickyNote = document.querySelector(".stickynote");
let stickyNoteTools = document.querySelector(".stickynote-tools");
let stickyNoteToolsFlag = false;

let upload = document.querySelector(".upload");

let shapes = document.querySelector(".shapes");
let shapesTools = document.querySelector(".shapes-tools");
let shapesToolsFlag = false;

let text = document.querySelector(".text");
let textTools = document.querySelector(".text-tools");
let textToolsFlag = false;

let canvasBgColor = document.querySelector(".canvas-bgcolor");
let canvasBgColorTools = document.querySelector(".canvas-bgcolor-tools");
let canvasBgColorToolsFlag = false;

let dragEl;
let dragHandleEl;
const lastPosition = {};

toggleOptions.addEventListener("click", (e) => {
  toggleFlag = !toggleFlag;

  if (toggleFlag) {
    openTools();
  } else {
    closeTools();
  }
});

function openTools() {
  let openToolsImg = toggleOptions.children[0];
  openToolsImg.src = "./icons/tools/close.png";
  openToolsImg.title = "Close Menu";

  tools.style.display = "flex";
}

function closeTools() {
  let closeToolsImg = toggleOptions.children[0];
  closeToolsImg.src = "./icons/tools/menu.png";
  closeToolsImg.title = "Open Menu";

  tools.style.display = "none";
  hideAllTools();
}

function toggleTool(toolFlag, otherToolFlags, tool, toolTools, cursorClass) {
  resetCursor();
  otherToolFlags.forEach((flag) => (flag = false));

  if (toolFlag) {
    hideAllTools();
    document.body.classList.add(cursorClass);
    toolTools.style.display = "flex";
  } else {
    toolTools.style.display = "none";
  }
}

function hideAllTools() {
  pencilTools.style.display = "none";
  markerTools.style.display = "none";
  eraserTools.style.display = "none";
  textTools.style.display = "none";
  shapesTools.style.display = "none";
  stickyNoteTools.style.display = "none";
  canvasBgColorTools.style.display = "none";
}

pencil.addEventListener("click", (e) => {
  pencilToolsFlag = !pencilToolsFlag;
  toggleTool(
    pencilToolsFlag,
    [
      markerToolsFlag,
      eraserToolsFlag,
      shapesToolsFlag,
      textToolsFlag,
      canvasBgColorToolsFlag,
    ],
    pencil,
    pencilTools,
    "cursor-pencil"
  );
});

text.addEventListener("click", (e) => {
  textToolsFlag = !textToolsFlag;
  toggleTool(
    textToolsFlag,
    [
      markerToolsFlag,
      eraserToolsFlag,
      shapesToolsFlag,
      pencilToolsFlag,
      canvasBgColorToolsFlag,
    ],
    text,
    textTools,
    "cursor-auto"
  );
});

marker.addEventListener("click", (e) => {
  markerToolsFlag = !markerToolsFlag;
  toggleTool(
    markerToolsFlag,
    [
      pencilToolsFlag,
      eraserToolsFlag,
      shapesToolsFlag,
      textToolsFlag,
      canvasBgColorToolsFlag,
    ],
    marker,
    markerTools,
    "cursor-marker"
  );
});

eraser.addEventListener("click", (e) => {
  eraserToolsFlag = !eraserToolsFlag;
  toggleTool(
    eraserToolsFlag,
    [
      pencilToolsFlag,
      markerToolsFlag,
      shapesToolsFlag,
      textToolsFlag,
      canvasBgColorToolsFlag,
    ],
    eraser,
    eraserTools,
    "cursor-eraser"
  );
});

shapes.addEventListener("click", (e) => {
  shapesToolsFlag = !shapesToolsFlag;
  toggleTool(
    shapesToolsFlag,
    [
      pencilToolsFlag,
      markerToolsFlag,
      eraserToolsFlag,
      textToolsFlag,
      canvasBgColorToolsFlag,
    ],
    shapes,
    shapesTools,
    "cursor-auto"
  );
});

canvasBgColor.addEventListener("click", (e) => {
  canvasBgColorToolsFlag = !canvasBgColorToolsFlag;
  toggleTool(
    canvasBgColorToolsFlag,
    [
      pencilToolsFlag,
      markerToolsFlag,
      eraserToolsFlag,
      textToolsFlag,
      shapesToolsFlag,
    ],
    canvasBgColor,
    canvasBgColorTools,
    "cursor-auto"
  );
});

function noteActions(minimizeNote, removeNote, stickyNoteDoc) {
  minimizeNote.addEventListener("click", (e) => {
    let noteBody = stickyNoteDoc.querySelector(".body-note");

    if (noteBody.style.display === "none") {
      noteBody.style.display = "block";
    } else {
      noteBody.style.display = "none";
    }
  });

  removeNote.addEventListener("click", (e) => {
    stickyNoteDoc.remove();
  });
}

stickyNote.addEventListener("click", (e) => {
  resetCursor();

  stickyNoteToolsFlag = !stickyNoteToolsFlag;

  if (stickyNoteToolsFlag) {
    pencilTools.style.display = "none";
    markerTools.style.display = "none";
    eraserTools.style.display = "none";
    textTools.style.display = "none";
    canvasBgColorTools.style.display = "none";
    shapesTools.style.display = "none";

    stickyNoteTools.style.display = "flex";
    stickyNoteTools.style.flexDirection = "column";
  } else {
    stickyNoteTools.style.display = "none";
  }

  let backgroundColors = stickyNoteTools.querySelectorAll(".notes-color");

  backgroundColors.forEach((color) => {
    color.addEventListener("click", (e) => {
      let stickyNoteDoc = document.createElement("div");
      stickyNoteDoc.classList.add("sticky-note");
      stickyNoteDoc.innerHTML = `
      <div class="header-note">
        <div class="minimize-note"></div>
        <div class="remove-note"></div>
      </div>
      <div class="body-note">
        <div class="${color.classList[0]} input-note" contenteditable="true"></div>
      </div>`;

      document.body.appendChild(stickyNoteDoc);

      let minimizeNote = stickyNoteDoc.querySelector(".minimize-note");
      let removeNote = stickyNoteDoc.querySelector(".remove-note");
      noteActions(minimizeNote, removeNote, stickyNoteDoc);

      stickyNoteDoc.onmousedown = function (event) {
        dragAndDrop(stickyNoteDoc, event);
      };
      stickyNoteDoc.ondragstart = function () {
        return false;
      };
    });
  });
});

upload.addEventListener("click", (e) => {
  resetCursor();

  let fileInput = document.createElement("input");
  fileInput.setAttribute("type", "file");
  fileInput.click();

  fileInput.addEventListener("change", (e) => {
    let file = fileInput.files[0];
    let url = URL.createObjectURL(file);

    let stickyNoteDoc = document.createElement("div");
    stickyNoteDoc.classList.add("sticky-note-image");
    stickyNoteDoc.setAttribute("data-resizable", true);
    stickyNoteDoc.setAttribute("data-draggable", true);

    stickyNoteDoc.innerHTML = `
      <div class="header-note drag-handle" data-drag-handle="true">
        <div class="minimize-note"></div>
        <div class="remove-note"></div>
      </div>
      <div class="body-note">
          <img src="${url}" class="upload-img-note" />
      </div>`;
    document.body.appendChild(stickyNoteDoc);

    let minimizeNote = stickyNoteDoc.querySelector(".minimize-note");
    let removeNote = stickyNoteDoc.querySelector(".remove-note");
    noteActions(minimizeNote, removeNote, stickyNoteDoc);

    setupResizable();
    setupDraggable();
  });
});

function dragAndDrop(element, event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = "absolute";
  element.style.zIndex = 1000;

  moveAt(event.pageX, event.pageY);

  // moves the element at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the element on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the element, remove unneeded handlers
  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
}

function setupResizable() {
  const resizeElemets = document.querySelectorAll("[data-resizable]");

  resizeElemets.forEach((resizeElement) => {
    resizeElement.style.setProperty("resize", "both");
    resizeElement.style.setProperty("overflow", "hidden");
  });
}

function setupDraggable() {
  let stickyNotes = document.querySelectorAll(".sticky-note-image");

  stickyNotes.forEach((stickyNote) => {
    stickyNote.addEventListener("mousedown", dragStart);
    stickyNote.addEventListener("mouseup", dragEnd);
    stickyNote.addEventListener("mouseout", dragEnd);
  });
}

function dragStart(event) {
  dragEl = getDraggableAncestor(event.target);
  dragEl.style.setProperty("position", "absolute");
  lastPosition.left = event.clientX;
  lastPosition.top = event.clientY;
  document.addEventListener("mousemove", dragMove);
}

function dragMove(event) {
  if (dragEl) {
    const newLeft = dragEl.offsetLeft + event.clientX - lastPosition.left;
    const newTop = dragEl.offsetTop + event.clientY - lastPosition.top;
    dragEl.style.left = `${newLeft}px`;
    dragEl.style.top = `${newTop}px`;
    lastPosition.left = event.clientX;
    lastPosition.top = event.clientY;
  }
}

function getDraggableAncestor(element) {
  if (element.classList.contains("sticky-note-image")) {
    return element;
  } else {
    return getDraggableAncestor(element.parentElement);
  }
}

function dragEnd() {
  document.removeEventListener("mousemove", dragMove);
  dragEl = null;
}

function resetCursor() {
  document.body.classList.remove("cursor-pencil");
  document.body.classList.remove("cursor-eraser");
  document.body.classList.remove("cursor-marker");
  document.body.classList.add("cursor-auto");
}
