let toggleOptions = document.querySelector(".toggle-options");
let toggleFlag = true;

let tools = document.querySelector(".tools");

let pencil = document.querySelector(".pencil");
let pencilTools = document.querySelector(".pencil-tools");
let pencilToolsFlag = { value: false };

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
}

pencil.addEventListener("click", (e) => {
  pencilToolsFlag.value = !pencilToolsFlag.value;
  toggleTool(pencilToolsFlag.value, [], pencil, pencilTools, "cursor-pencil");
});

function resetCursor() {
  document.body.classList.remove("cursor-pencil");
}
