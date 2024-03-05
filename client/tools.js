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
}

pencil.addEventListener("click", (e) => {
  pencilToolsFlag.value = !pencilToolsFlag.value;
  toggleTool(
    pencilToolsFlag.value,
    [markerToolsFlag, eraserToolsFlag],
    pencil,
    pencilTools,
    "cursor-pencil"
  );
});

marker.addEventListener("click", (e) => {
  markerToolsFlag.value = !markerToolsFlag.value;
  toggleTool(
    markerToolsFlag.value,
    [pencilToolsFlag, eraserToolsFlag],
    marker,
    markerTools,
    "cursor-marker"
  );
});

eraser.addEventListener("click", (e) => {
  eraserToolsFlag.value = !eraserToolsFlag.value;
  toggleTool(
    eraserToolsFlag.value,
    [pencilToolsFlag, markerToolsFlag],
    eraser,
    eraserTools,
    "cursor-eraser"
  );
});

function resetCursor() {
  document.body.classList.remove("cursor-pencil");
  document.body.classList.remove("cursor-eraser");
  document.body.classList.remove("cursor-marker");
}
