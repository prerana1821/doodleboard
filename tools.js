let toggleOptions = document.querySelector(".toggle-options");
let toggleFlag = true;

let tools = document.querySelector(".tools");

let pencil = document.querySelector(".pencil");
let pencilTools = document.querySelector(".pencil-tools");
let pencilToolsFlag = false;

let eraser = document.querySelector(".eraser");
let eraserTools = document.querySelector(".eraser-tools");
let eraserToolsFlag = false;

let stickyNote = document.querySelector(".stickynote");
let stickyNoteTools = document.querySelector(".stickynote-tools");
let stickyNoteToolsFlag = false;

let upload = document.querySelector(".upload");

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
  openToolsImg.src = "./icons/close.png";

  tools.style.display = "flex";
}

function closeTools() {
  let closeToolsImg = toggleOptions.children[0];
  closeToolsImg.src = "./icons/menu.png";

  tools.style.display = "none";
  pencilTools.style.display = "none";
  eraserTools.style.display = "none";
}

pencil.addEventListener("click", (e) => {
  pencilToolsFlag = !pencilToolsFlag;

  if (pencilToolsFlag) {
    eraserTools.style.display = "none";
    stickyNoteTools.style.display = "none";
    pencilTools.style.display = "flex";
  } else {
    pencilTools.style.display = "none";
  }
});

eraser.addEventListener("click", (e) => {
  eraserToolsFlag = !eraserToolsFlag;

  if (eraserToolsFlag) {
    pencilTools.style.display = "none";
    stickyNoteTools.style.display = "none";
    eraserTools.style.display = "flex";
  } else {
    eraserTools.style.display = "none";
  }
});

stickyNote.addEventListener("click", (e) => {
  stickyNoteToolsFlag = !stickyNoteToolsFlag;

  if (stickyNoteToolsFlag) {
    pencilTools.style.display = "none";
    eraserTools.style.display = "none";
    stickyNoteTools.style.display = "flex";
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
        <textarea class=" ${color.classList[0]} input-note"></textarea>
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

function noteActions(minimizeNote, removeNote, stickyNoteDoc) {
  minimizeNote.addEventListener("click", (e) => {
    let noteBody = stickyNoteDoc.querySelector(".body-note");

    let noteBodyVisibility =
      getComputedStyle(noteBody).getPropertyValue("display");

    console.log({ noteBodyVisibility });
    if (noteBodyVisibility === "none") {
      noteBody.style.display = "block";
    } else {
      noteBody.style.display = "none";
    }
  });

  removeNote.addEventListener("click", (e) => {
    stickyNoteDoc.remove();
  });
}

upload.addEventListener("click", (e) => {
  let fileInput = document.createElement("input");
  fileInput.setAttribute("type", "file");
  fileInput.click();

  fileInput.addEventListener("change", (e) => {
    let file = fileInput.files[0];
    let url = URL.createObjectURL(file);

    let stickyNoteDoc = document.createElement("div");
    stickyNoteDoc.classList.add("sticky-note");
    stickyNoteDoc.classList.add("resizable");

    stickyNoteDoc.innerHTML = `
      <div class="header-note">
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

    stickyNoteDoc.onmousedown = function (event) {
      dragAndDrop(stickyNoteDoc, event);
    };
    stickyNoteDoc.ondragstart = function () {
      return false;
    };

    let resizer = document.createElement("div");
    resizer.className = "resizer";
    resizer.style.width = "10px";
    resizer.style.height = "10px";
    resizer.style.background = "black";
    resizer.style.position = "absolute";
    resizer.style.right = 0;
    resizer.style.bottom = 0;
    resizer.style.cursor = "se-resize";
    stickyNoteDoc.appendChild(resizer);
    resizer.addEventListener("mousedown", initResize, false);

    function initResize(e) {
      e.preventDefault(); // Prevent default behavior which might interfere with resizing
      let initialWidth = parseInt(
        document.defaultView.getComputedStyle(stickyNoteDoc).width,
        10
      );
      let initialHeight = parseInt(
        document.defaultView.getComputedStyle(stickyNoteDoc).height,
        10
      );
      let startX = e.clientX;
      let startY = e.clientY;

      window.addEventListener("mousemove", Resize, false);
      window.addEventListener("mouseup", stopResize, false);

      function Resize(e) {
        e.preventDefault(); // Prevent default behavior which might interfere with resizing
        let width = initialWidth + e.clientX - startX;
        let height = initialHeight + e.clientY - startY;
        stickyNoteDoc.style.width = width + "px";
        stickyNoteDoc.style.height = height + "px";
      }

      function stopResize(e) {
        e.preventDefault(); // Prevent default behavior which might interfere with resizing
        window.removeEventListener("mousemove", Resize, false);
        window.removeEventListener("mouseup", stopResize, false);
      }
    }
  });
});
