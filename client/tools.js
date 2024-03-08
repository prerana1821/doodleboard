let toggleOptions = document.querySelector(".toggle-options");
let toggleFlag = true;

let tools = document.querySelector(".tools");

let pencil = document.querySelector(".pencil");
let pencilTools = document.querySelector(".pencil-tools");
let pencilToolsFlag = { value: false };

let marker = document.querySelector(".marker");
let markerTools = document.querySelector(".marker-tools");
let markerToolsFlag = { value: false };

let eraser = document.querySelector(".eraser");
let eraserTools = document.querySelector(".eraser-tools");
let eraserToolsFlag = { value: false };

let shapes = document.querySelector(".shapes");
let shapesTools = document.querySelector(".shapes-tools");
let shapesToolsFlag = false;

let stickyNote = document.querySelector(".stickynote");
let stickyNoteTools = document.querySelector(".stickynote-tools");
let stickyNoteToolsFlag = { value: false };

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

  otherToolFlags.forEach(
    (flag, index) => (otherToolFlags[index].value = false)
  );

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
  shapesTools.style.display = "none";
  stickyNoteTools.style.display = "none";
}

pencil.addEventListener("click", (e) => {
  pencilToolsFlag.value = !pencilToolsFlag.value;
  toggleTool(
    pencilToolsFlag.value,
    [markerToolsFlag, eraserToolsFlag, shapesToolsFlag],
    pencil,
    pencilTools,
    "cursor-pencil"
  );
});

marker.addEventListener("click", (e) => {
  markerToolsFlag.value = !markerToolsFlag.value;
  toggleTool(
    markerToolsFlag.value,
    [pencilToolsFlag, eraserToolsFlag, shapesToolsFlag],
    marker,
    markerTools,
    "cursor-marker"
  );
});

eraser.addEventListener("click", (e) => {
  eraserToolsFlag.value = !eraserToolsFlag.value;
  toggleTool(
    eraserToolsFlag.value,
    [pencilToolsFlag, markerToolsFlag, shapesToolsFlag],
    eraser,
    eraserTools,
    "cursor-eraser"
  );
});

shapes.addEventListener("click", (e) => {
  shapesToolsFlag = !shapesToolsFlag;
  toggleTool(
    shapesToolsFlag,
    [pencilToolsFlag, markerToolsFlag, eraserToolsFlag],
    shapes,
    shapesTools,
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
  addCursorAuto();

  stickyNoteToolsFlag.value = !stickyNoteToolsFlag.value;

  if (stickyNoteToolsFlag.value) {
    pencilTools.style.display = "none";
    markerTools.style.display = "none";
    eraserTools.style.display = "none";

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

function resetCursor() {
  document.body.classList.remove("cursor-pencil");
  document.body.classList.remove("cursor-eraser");
  document.body.classList.remove("cursor-marker");
  document.body.classList.add("cursor-auto");
}

function addCursorAuto() {
  document.body.classList.add("cursor-auto");
}
